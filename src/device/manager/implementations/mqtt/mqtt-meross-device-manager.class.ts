import { AsyncTask, IAsyncTaskConstraint } from '@lirx/async-task';
import {
  filterPushPipeWithBackPressure,
  IMapFilterPushPipeWithBackPressureFunctionReturn,
  IPushSourceWithBackPressure,
  MAP_FILTER_PUSH_PIPE_WITH_BACK_PRESSURE_DISCARD,
  mapFilterPushPipeWithBackPressure,
  sharePushPipeWithBackPressure,
} from '@lirx/stream';
import { IUrlRewriter, NO_URL_REWRITE } from '@thingmate/wot-scripting-api';
import { IAppId } from '../../../../types/app-id.type';
import { IDeviceId } from '../../../../types/device-id.type';
import { IUserId } from '../../../../types/user-id.type';
import { IUserKey } from '../../../../types/user-key.type';
import { createMerossPacket } from '../../../packet/functions/create-meross-packet';
import { DEFAULT_MEROSS_MQTT_PORT } from '../../../packet/functions/mqtt/constants/default-meross-mqtt-port.constant';
import { MEROSS_MQTT_CLIENT_POOL } from '../../../packet/functions/mqtt/pool/meross-mqtt-client-pool.constant';
import {
  extractDeviceIdFromMerossApplianceDeviceIdPublishTopic,
} from '../../../packet/functions/mqtt/topics/get-meross-appliance-device-id-publish-topic';
import { IGenericMerossPacket } from '../../../packet/meross-packet.type';
import { IMerossDeviceManager } from '../../meross-device-manager.type';
import { IMerossDeviceManagerQueryOptions } from '../../traits/query/meross-device-manager.query.function-definition';

/* TYPES */

// -- CONSTRUCTOR --

export interface IMqttMerossDeviceManagerOptions {
  // meross context
  readonly key: IUserKey;
  readonly userId: IUserId;
  readonly appId: IAppId;
  readonly deviceId: IDeviceId;

  // mqtt context
  readonly hostname: string;
  readonly port?: number;
  readonly urlRewriter?: IUrlRewriter;
  readonly unsubscribeDelay?: number;
  readonly disposeDelay?: number;
}

/* CLASS */

export class MqttMerossDeviceManager implements IMerossDeviceManager {
  // meross context
  readonly #key: IUserKey;
  readonly #userId: IUserId;
  readonly #appId: IAppId;
  readonly #deviceId: IDeviceId;

  // mqtt context
  readonly #hostname: string;
  readonly #port: number;
  readonly #urlRewriter: IUrlRewriter;
  readonly #unsubscribeDelay: number;
  readonly #disposeDelay: number;

  readonly #packetsObserver$: IPushSourceWithBackPressure<IGenericMerossPacket>;

  constructor(
    {
      // meross context
      key,
      userId,
      appId,
      deviceId,
      // mqtt context
      hostname,
      port = DEFAULT_MEROSS_MQTT_PORT,
      urlRewriter = NO_URL_REWRITE,
      unsubscribeDelay = 5000,
      disposeDelay = 60 * 1000,
    }: IMqttMerossDeviceManagerOptions,
  ) {
    this.#key = key;
    this.#userId = userId;
    this.#appId = appId;
    this.#deviceId = deviceId;

    this.#hostname = hostname;
    this.#port = port;
    this.#urlRewriter = urlRewriter;
    this.#unsubscribeDelay = unsubscribeDelay;
    this.#disposeDelay = disposeDelay;

    this.#packetsObserver$ = sharePushPipeWithBackPressure<IGenericMerossPacket>(
      filterPushPipeWithBackPressure(
        MEROSS_MQTT_CLIENT_POOL.observe({
          hostname,
          port,
          urlRewriter,
          key,
          userId,
          appId,
          disposeDelay,
        }),
        (value: IGenericMerossPacket): boolean => {
          return (extractDeviceIdFromMerossApplianceDeviceIdPublishTopic(value.header.from) === deviceId);
        },
      ),
    );
  }

  query<GResponsePayload extends IAsyncTaskConstraint<GResponsePayload>>(
    {
      method,
      namespace,
      payload,
      abortable,
    }: IMerossDeviceManagerQueryOptions,
  ): AsyncTask<GResponsePayload> {
    return MEROSS_MQTT_CLIENT_POOL.send<GResponsePayload>({
      hostname: this.#hostname,
      port: this.#port,
      urlRewriter: this.#urlRewriter,
      key: this.#key,
      userId: this.#userId,
      appId: this.#appId,
      deviceId: this.#deviceId,
      packet: createMerossPacket<any>({
        key: this.#key,
        userId: this.#userId,
        appId: this.#appId,
        method,
        namespace,
        payload,
      }),
      unsubscribeDelay: this.#unsubscribeDelay,
      disposeDelay: this.#disposeDelay,
      abortable,
    });
  }

  observe<GResponsePayload extends IAsyncTaskConstraint<GResponsePayload>>(
    namespace: string,
  ): IPushSourceWithBackPressure<GResponsePayload> {
    return mapFilterPushPipeWithBackPressure<IGenericMerossPacket, GResponsePayload>(
      this.#packetsObserver$,
      (
        packet: IGenericMerossPacket,
      ): IMapFilterPushPipeWithBackPressureFunctionReturn<GResponsePayload> => {
        if (packet.header.namespace === namespace) {
          return packet.payload;
        } else {
          return MAP_FILTER_PUSH_PIPE_WITH_BACK_PRESSURE_DISCARD;
        }
      },
    );
  }
}
