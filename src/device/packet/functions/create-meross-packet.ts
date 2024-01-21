import { md5 } from '@lifaon/md5';
import { IAppId } from '../../../types/app-id.type';
import { IUserId } from '../../../types/user-id.type';
import { IUserKey } from '../../../types/user-key.type';

import { IMerossPacket, IMerossPacketMethod } from '../meross-packet.type';
import { getMerossAppUserIdAppIdSubscribeTopic } from './mqtt/topics/get-meross-app-user-id-app-id-subscribe-topic';

// export interface ICreateMerossPacketOptions<GPayload> extends //
//   Omit<IMerossPacketHeader, 'messageId' | 'payloadVersion' | 'from' | 'timestamp' | 'timestampMs' | 'sign'>,
//   Omit<IMerossPacket<GPayload>, 'header'>,
//   IGetMerossAppUserIdAppIdSubscribeTopicOptions,
//   IHavingUserKey
// //
// {
//
// }

export interface ICreateMerossPacketOptions<GPayload> {
  readonly method: IMerossPacketMethod;
  readonly namespace: string; // name of the command
  readonly payload: GPayload;
  readonly key: IUserKey;
  readonly userId: IUserId;
  readonly appId: IAppId;
}

/**
 * Creates a Meross Packet which will be used over http or mqtt.
 */
export function createMerossPacket<GPayload>(
  {
    method,
    namespace,
    payload,
    key,
    userId,
    appId,
  }: ICreateMerossPacketOptions<GPayload>,
): IMerossPacket<GPayload> {
  const messageId: string = md5(crypto.randomUUID());
  const now: number = Date.now();

  const timestamp: number = Math.floor(now / 1000);  //int(round(time.time()))
  const timestampMs: number = now - timestamp;  //int(round(time.time()))

  const sign: string = md5(messageId + key + timestamp);

  return {
    header: {
      from: getMerossAppUserIdAppIdSubscribeTopic({
        userId,
        appId,
      }),
      messageId,
      method,
      namespace,
      payloadVersion: 1,
      sign,
      timestamp,
      timestampMs,
    },
    payload,
  };
}
