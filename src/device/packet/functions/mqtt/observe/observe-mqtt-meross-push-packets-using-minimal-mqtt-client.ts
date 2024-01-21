import { IAsyncTaskInput } from '@lirx/async-task';
import { IPushSourceWithBackPressure, mapPushPipeWithBackPressure } from '@lirx/stream';
import { IMinimalMqttClientObserveTrait, IReadonlyMqttPacketPayload } from '@thingmate/mqtt';
import { IUserId } from '../../../../../types/user-id.type';
import { IUserKey } from '../../../../../types/user-key.type';

import { IGenericMerossPacket } from '../../../meross-packet.type';
import { verifyMerossPacket } from '../../verify-meross-packet';
import { getMerossAppUserIdSubscribeTopic } from '../topics/get-meross-app-user-id-subscribe-topic';

export interface IObserveMqttMerossPUSHPacketsUsingMinimalMqttClientOptions {
  readonly client: IMinimalMqttClientObserveTrait;
  readonly userId: IUserId;
  readonly key: IUserKey;
}

/**
 * Creates a `PushSourceWithBackPressure` listening for `PUSH` packet, and emitting them.
 */
export function observeMqttMerossPUSHPacketsUsingMinimalMqttClient(
  {
    client,
    userId,
    key,
  }: IObserveMqttMerossPUSHPacketsUsingMinimalMqttClientOptions,
): IPushSourceWithBackPressure<IGenericMerossPacket> {
  return mapPushPipeWithBackPressure<IReadonlyMqttPacketPayload, IGenericMerossPacket>(
    client.observe(
      getMerossAppUserIdSubscribeTopic({
        userId,
      }),
    ),
    (
      payload: IReadonlyMqttPacketPayload,
    ): IAsyncTaskInput<IGenericMerossPacket> => {
      const merossResponsePacket: IGenericMerossPacket = JSON.parse(payload.toString());

      // TODO discard invalid packet instead of erroring stream ?
      if (merossResponsePacket.header.method === 'PUSH') {
        verifyMerossPacket({
          packet: merossResponsePacket,
          key,
        });
        return merossResponsePacket;
      } else {
        console.log(merossResponsePacket);
        throw new Error(`Expected PUSH packet`);
      }
    });
}
