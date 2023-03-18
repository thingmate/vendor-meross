import { IAsyncTaskInput } from '@lirx/async-task';
import { IPushSourceWithBackPressure, mapPushPipeWithBackPressure } from '@lirx/stream';
import { IMqttClient, IStandardMqttPublishPacket } from '@thingmate/mqtt';
import { IHavingUserKey } from '../../../types/user-key.type';
import {
  getMerossAppUserIdSubscribeTopic,
  IGetMerossAppUserIdSubscribeTopicOptions,
} from '../../shared/get-meross-app-user-id-subscribe-topic';
import { IGenericMerossPacket } from '../meross-packet.type';
import { verifyMerossPacket } from '../verify-meross-packet';

export interface ICreateMqttMerossPUSHPacketListenerOptions extends //
  IGetMerossAppUserIdSubscribeTopicOptions,
  IHavingUserKey
//
{
  client: IMqttClient;
}

export function createMqttMerossPUSHPacketListener(
  {
    client,
    userId,
    key,
  }: ICreateMqttMerossPUSHPacketListenerOptions,
): IPushSourceWithBackPressure<IGenericMerossPacket> {
  const appliancePushNotifications$ = client.on(
    getMerossAppUserIdSubscribeTopic({
      userId,
    }),
  );

  return mapPushPipeWithBackPressure(
    appliancePushNotifications$,
    (
      standardMqttPublishPacket: IStandardMqttPublishPacket,
    ): IAsyncTaskInput<IGenericMerossPacket> => {
      const merossResponsePacket: IGenericMerossPacket = JSON.parse(standardMqttPublishPacket.payload.toString());

      // TODO discard invalid packet instead of erroring stream
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
