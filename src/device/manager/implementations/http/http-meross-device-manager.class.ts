import { AsyncTask, IAsyncTaskConstraint } from '@lirx/async-task';
import { IPushSourceWithBackPressure } from '@lirx/stream';
import { IUrlRewriter, NO_URL_REWRITE } from '@thingmate/wot-scripting-api';
import { IAppId } from '../../../../types/app-id.type';
import { IUserId } from '../../../../types/user-id.type';
import { IUserKey } from '../../../../types/user-key.type';
import { createMerossPacket } from '../../../packet/functions/create-meross-packet';
import { sendHttpMerossPacket } from '../../../packet/functions/http/send-http-meross-packet';
import { IMerossDeviceManager } from '../../meross-device-manager.type';
import { IMerossDeviceManagerQueryOptions } from '../../traits/query/meross-device-manager.query.function-definition';

/* TYPES */

// -- CONSTRUCTOR --

export interface IHttpMerossDeviceManagerOptions {
  // meross context
  readonly key: IUserKey;
  readonly userId: IUserId;
  readonly appId: IAppId;

  // http context
  readonly hostname: string;
  readonly urlRewriter?: IUrlRewriter;
}

/* CLASS */

export class HttpMerossDeviceManager implements IMerossDeviceManager {
  // meross context
  readonly #key: IUserKey;
  readonly #userId: IUserId;
  readonly #appId: IAppId;

  // http context
  readonly #hostname: string;
  readonly #urlRewriter: IUrlRewriter;

  constructor(
    {
      // meross context
      key,
      userId,
      appId,
      // http context
      hostname,
      urlRewriter = NO_URL_REWRITE,
    }: IHttpMerossDeviceManagerOptions,
  ) {
    this.#key = key;
    this.#userId = userId;
    this.#appId = appId;

    this.#hostname = hostname;
    this.#urlRewriter = urlRewriter;
  }

  query<GResponsePayload extends IAsyncTaskConstraint<GResponsePayload>>(
    {
      method,
      namespace,
      payload,
      abortable,
    }: IMerossDeviceManagerQueryOptions,
  ): AsyncTask<GResponsePayload> {
    return sendHttpMerossPacket<GResponsePayload>({
      hostname: this.#hostname,
      urlRewriter: this.#urlRewriter,
      key: this.#key,
      packet: createMerossPacket<any>({
        key: this.#key,
        userId: this.#userId,
        appId: this.#appId,
        method,
        namespace,
        payload,
      }),
      abortable,
    });
  }

  observe<GResponsePayload extends IAsyncTaskConstraint<GResponsePayload>>(
    namespace: string,
  ): IPushSourceWithBackPressure<GResponsePayload> {
    throw new Error(`Observing is not implemented with the http protocol.`);
  }
}
