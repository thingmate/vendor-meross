import { md5 } from '@lifaon/md5';
import { IHavingUserKey } from '../../types/user-key.type';
import { IGenericMerossPacket } from './meross-packet.type';

export interface IVerifyMerossPacketOptions extends IHavingUserKey {
  packet: IGenericMerossPacket;
}

export function verifyMerossPacket(
  {
    packet,
    key,
  }: IVerifyMerossPacketOptions,
): void {
  if (packet.header.payloadVersion !== 1) {
    throw new Error(`Only payloadVersion 1 is supported`);
  }

  const sign: string = md5(packet.header.messageId + key + packet.header.timestamp);
  if (packet.header.sign !== sign) {
    throw new Error(`Invalid signature`);
  }
}
