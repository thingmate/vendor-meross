import { md5 } from '@lifaon/md5';
import { Abortable, AsyncTask, IAbortableOptions, IAsyncTaskConstraint, IAsyncTaskInput } from '@lirx/async-task';
import { IPushSinkWithBackPressure, IPushSourceWithBackPressure, sharePushPipeWithBackPressure } from '@lirx/stream';
import { IMqttProtocolVersion, IWebSocketMinimalMqttClientFromPool, WebSocketMinimalMqttClientPool } from '@thingmate/mqtt';
import { IUrlRewriter, NO_URL_REWRITE } from '@thingmate/wot-scripting-api';
import { IAppId } from '../../../../../types/app-id.type';
import { IDeviceId } from '../../../../../types/device-id.type';
import { IUserId } from '../../../../../types/user-id.type';
import { IUserKey } from '../../../../../types/user-key.type';
import { IGenericMerossPacket } from '../../../meross-packet.type';
import { DEFAULT_MEROSS_MQTT_PORT } from '../constants/default-meross-mqtt-port.constant';
import { observeMqttMerossPUSHPacketsUsingMinimalMqttClient } from '../observe/observe-mqtt-meross-push-packets-using-minimal-mqtt-client';
import {
  sendMqttMerossPacketUsingMinimalMqttClient,
  sendMqttMerossPacketUsingMinimalMqttClientAndTimeout,
} from '../send/send-mqtt-meross-packet-using-minimal-mqtt-client';

/* TYPES */

// CONSTRUCTOR

// export interface IMerossMqttClientPoolOptions {
//
// }

// OPEN
export interface IMerossMqttClientPoolOpenOptions extends IAbortableOptions {
  readonly hostname: string;
  readonly port?: number;
  readonly urlRewriter?: IUrlRewriter;
  readonly key: IUserKey;
  readonly userId: IUserId;
  readonly appId: IAppId;
}

// OPEN AND DISPOSE
export interface IMerossMqttClientPoolOpenAndDisposeOptions extends IAbortableOptions, Omit<IMerossMqttClientPoolOpenOptions, 'abortable>'> {
  readonly disposeDelay?: number;
}

export interface IMerossMqttClientPoolOpenAndDisposeFactory<GValue extends IAsyncTaskConstraint<GValue>> {
  (
    client: IWebSocketMinimalMqttClientFromPool,
    abortable: Abortable,
  ): IAsyncTaskInput<GValue>;
}

// SEND
export interface IMerossMqttClientPoolSendOptions extends IAbortableOptions, Omit<IMerossMqttClientPoolOpenAndDisposeOptions, 'abortable>'> {
  readonly deviceId: IDeviceId;
  readonly packet: IGenericMerossPacket;
  readonly unsubscribeDelay?: number;
}

// OBSERVE
export interface IMerossMqttClientPoolObserveOptions extends Omit<IMerossMqttClientPoolOpenAndDisposeOptions, 'abortable'> {
}

// INTERNAL
interface IMerossMqttClientPoolDisposeWhenTaskIsResolvedOptions<GTask extends AsyncTask<any>> {
  readonly task: GTask;
  readonly disposeDelay: number;
  readonly dispose: () => void;
}

/* CLASS */

export class MerossMqttClientPool {
  readonly #pool: WebSocketMinimalMqttClientPool;
  readonly #observePool: Map<string, IPushSourceWithBackPressure<IGenericMerossPacket>>;

  constructor() {
    this.#pool = new WebSocketMinimalMqttClientPool();
    this.#observePool = new Map<string, IPushSourceWithBackPressure<IGenericMerossPacket>>();
  }

  #disposeWhenTaskIsResolved<GTask extends AsyncTask<any>>(
    {
      task,
      disposeDelay,
      dispose,
    }: IMerossMqttClientPoolDisposeWhenTaskIsResolvedOptions<GTask>,
  ): GTask {
    AsyncTask.whenResolved(task, (): void => {
      if (disposeDelay <= 0) {
        dispose();
      } else {
        setTimeout(dispose, disposeDelay);
      }
    });
    return task;
  }

  open(
    {
      hostname,
      port = DEFAULT_MEROSS_MQTT_PORT,
      urlRewriter = NO_URL_REWRITE,
      key,
      userId,
      appId,
      abortable,
    }: IMerossMqttClientPoolOpenOptions,
  ): AsyncTask<IWebSocketMinimalMqttClientFromPool> {
    const url: URL = new URL(urlRewriter(`wss://${hostname}:${port}/mqtt`));
    const protocolVersion: IMqttProtocolVersion = 5;
    const keepalive: number = 30;
    const clientId: string = `app:${appId}`;
    const username: string = userId;
    const password: string = md5(userId + key);

    return this.#pool.open({
      url,
      protocolVersion,
      keepalive,
      clientId,
      username,
      password,
      abortable,
    });
  }

  openAndDispose<GValue extends IAsyncTaskConstraint<GValue>>(
    {
      disposeDelay = 60 * 1000,
      ...openOptions
    }: IMerossMqttClientPoolOpenAndDisposeOptions,
    factory: IMerossMqttClientPoolOpenAndDisposeFactory<GValue>,
  ): AsyncTask<GValue> {
    return this.open(openOptions)
      .successful((client: IWebSocketMinimalMqttClientFromPool, abortable: Abortable): AsyncTask<GValue> => {
        return this.#disposeWhenTaskIsResolved({
          task: AsyncTask.fromFactory<GValue>(
            (abortable: Abortable): IAsyncTaskInput<GValue> => {
              return factory(client, abortable);
            },
            abortable,
          ),
          disposeDelay,
          dispose: (): void => {
            client.dispose();
          },
        });
      });
  }

  send<GResponsePayload extends IAsyncTaskConstraint<GResponsePayload>>(
    {
      // to open the connection
      hostname,
      port,
      urlRewriter,
      key,
      userId,
      appId,
      // to send to packet
      deviceId,
      packet,
      unsubscribeDelay,
      disposeDelay,
      abortable,
    }: IMerossMqttClientPoolSendOptions,
  ): AsyncTask<GResponsePayload> {
    return this.openAndDispose<GResponsePayload>(
      {
        hostname,
        port,
        urlRewriter,
        key,
        userId,
        appId,
        disposeDelay,
        abortable,
      },
      (client: IWebSocketMinimalMqttClientFromPool, abortable: Abortable): AsyncTask<GResponsePayload> => {
        return sendMqttMerossPacketUsingMinimalMqttClientAndTimeout<GResponsePayload>({
          client,
          key,
          userId,
          appId,
          deviceId,
          packet,
          unsubscribeDelay,
          abortable,
        });
      },
    );
  }

  observe(
    {
      // to open the connection
      hostname,
      port = DEFAULT_MEROSS_MQTT_PORT,
      urlRewriter,
      key,
      userId,
      appId,
      disposeDelay,
    }: IMerossMqttClientPoolObserveOptions,
  ): IPushSourceWithBackPressure<IGenericMerossPacket> {
    const _key: string = md5(
      JSON.stringify([
        hostname,
        port,
        key,
        userId,
        appId,
      ]),
    );

    let source: IPushSourceWithBackPressure<IGenericMerossPacket> | undefined = this.#observePool.get(_key);

    if (source === void 0) {
      source = sharePushPipeWithBackPressure<IGenericMerossPacket>((
        sink: IPushSinkWithBackPressure<IGenericMerossPacket>,
        abortable: Abortable,
      ): AsyncTask<void> => {
        return this.openAndDispose(
          {
            hostname,
            port,
            urlRewriter,
            key,
            userId,
            appId,
            disposeDelay,
            abortable,
          },
          (client: IWebSocketMinimalMqttClientFromPool, abortable: Abortable): AsyncTask<void> => {
            return observeMqttMerossPUSHPacketsUsingMinimalMqttClient({
              client,
              userId,
              key,
            })(sink, abortable);
          },
        );
      });

      this.#observePool.set(_key, source);
    }

    return source;
  }
}


