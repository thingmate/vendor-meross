import { AsyncTask, IAsyncTaskConstraint } from '@lirx/async-task';
import { IPushSourceWithBackPressure } from '@lirx/stream';
import { IUrlRewriter } from '@thingmate/wot-scripting-api';
import { IAppId } from '../../../../types/app-id.type';
import { IDeviceId } from '../../../../types/device-id.type';
import { IUserId } from '../../../../types/user-id.type';
import { IUserKey } from '../../../../types/user-key.type';
import { IMerossDeviceManager } from '../../meross-device-manager.type';
import { IMerossDeviceManagerQueryOptions } from '../../traits/query/meross-device-manager.query.function-definition';
import { MqttMerossDeviceManager } from '../mqtt/mqtt-meross-device-manager.class';

/* TYPES */

// -- CONSTRUCTOR --

export interface IAutoMerossDeviceManagerMqttOptions {
  readonly hostname: string;
  readonly port?: number;
  readonly urlRewriter?: IUrlRewriter;
  readonly unsubscribeDelay?: number;
}

export interface IAutoMerossDeviceManagerHttpOptions {
  readonly hostname?: string;
  readonly urlRewriter?: IUrlRewriter;
}

export interface IAutoMerossDeviceManagerOptions {
  // meross context
  readonly key: IUserKey;
  readonly userId: IUserId;
  readonly appId: IAppId;
  readonly deviceId: IDeviceId;

  // protocols
  readonly mqtt: IAutoMerossDeviceManagerMqttOptions;
  readonly http?: IAutoMerossDeviceManagerHttpOptions;
}

/* CLASS */

export class AutoMerossDeviceManager implements IMerossDeviceManager {
  // meross context
  // readonly #key: IUserKey;
  // readonly #userId: IUserId;
  // readonly #appId: IAppId;

  // mqtt
  readonly #mqttHostname: string;
  readonly #mqttPort: number | undefined;
  readonly #mqttUrlRewriter: IUrlRewriter | undefined;
  readonly #mqttUnsubscribeDelay: number | undefined;

  // http
  readonly #httpHostname: string | undefined;
  readonly #httpUrlRewriter: IUrlRewriter | undefined;

  // TODO finish this class
  readonly #mqttManager: MqttMerossDeviceManager;

  constructor(
    {
      // meross context
      key,
      userId,
      appId,
      deviceId,
      // protocols
      mqtt: {
        hostname: mqttHostname,
        port: mqttPort,
        urlRewriter: mqttUrlRewriter,
        unsubscribeDelay: mqttUnsubscribeDelay,
      },
      http: {
        hostname: httpHostname,
        urlRewriter: httpUrlRewriter,
      } = {},
    }: IAutoMerossDeviceManagerOptions,
  ) {
    this.#mqttHostname = mqttHostname;
    this.#mqttPort = mqttPort;
    this.#mqttUrlRewriter = mqttUrlRewriter;
    this.#mqttUnsubscribeDelay = mqttUnsubscribeDelay;

    this.#httpHostname = httpHostname;
    this.#httpUrlRewriter = httpUrlRewriter;

    this.#mqttManager = new MqttMerossDeviceManager({
      key,
      userId,
      appId,
      deviceId,
      hostname: mqttHostname,
      port: mqttPort,
      urlRewriter: mqttUrlRewriter,
      unsubscribeDelay: mqttUnsubscribeDelay,
    });
  }

  query<GResponsePayload extends IAsyncTaskConstraint<GResponsePayload>>(
    options: IMerossDeviceManagerQueryOptions,
  ): AsyncTask<GResponsePayload> {
    return this.#mqttManager.query<GResponsePayload>(options);
  }

  observe<GResponsePayload extends IAsyncTaskConstraint<GResponsePayload>>(
    namespace: string,
  ): IPushSourceWithBackPressure<GResponsePayload> {
    return this.#mqttManager.observe<GResponsePayload>(namespace);
  }
}
