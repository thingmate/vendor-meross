import { md5 } from '@lifaon/md5';
import { IHavingUserKey } from '../../types/having-user-key.type';
import {
  getMerossAppUserIdAppIdSubscribeTopic,
  IGetMerossAppUserIdAppIdSubscribeTopicOptions,
} from '../shared/get-meross-app-user-id-app-id-subscribe-topic';
import { IMerossPacket, IMerossPacketHeader } from './meross-packet.type';

export interface ICreateMerossPacketOptions<GPayload> extends //
  Omit<IMerossPacketHeader, 'messageId' | 'payloadVersion' | 'from' | 'timestamp' | 'timestampMs' | 'sign'>,
  Omit<IMerossPacket<GPayload>, 'header'>,
  IGetMerossAppUserIdAppIdSubscribeTopicOptions,
  IHavingUserKey
//
{
}

export function createMerossPacket<GPayload>(
  {
    method,
    namespace,
    payload,
    key,
    ...options
  }: ICreateMerossPacketOptions<GPayload>,
): IMerossPacket<GPayload> {
  const messageId = md5(crypto.randomUUID());
  const now = Date.now();

  const timestamp = Math.floor(now / 1000);  //int(round(time.time()))
  const timestampMs = now - timestamp;  //int(round(time.time()))

  const sign: string = md5(messageId + key + timestamp);

  return {
    header: {
      from: getMerossAppUserIdAppIdSubscribeTopic(options),
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
