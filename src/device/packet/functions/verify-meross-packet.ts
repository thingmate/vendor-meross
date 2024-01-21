import { md5 } from '@lifaon/md5';
import { IUserKey } from '../../../types/user-key.type';
import { IGenericMerossPacket } from '../meross-packet.type';

export interface IVerifyMerossPacketOptions {
  readonly packet: IGenericMerossPacket;
  readonly key: IUserKey;
}

/**
 * Verifies that a Meross Packet has a valid signature.
 */
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
