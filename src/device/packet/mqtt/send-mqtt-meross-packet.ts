import {
  Abortable,
  AsyncTask,
  IAbortableOptions,
  IAsyncTaskConstraint,
  IAsyncTaskErrorFunction,
  IAsyncTaskSuccessFunction,
} from '@lirx/async-task';
import { IMqttClient, IStandardMqttPublishPacket } from '@thingmate/mqtt';
import { getMerossApplianceDeviceIdSubscribeTopic, IGetMerossApplianceDeviceIdSubscribeTopicOptions } from '../../shared/get-meross-appliance-device-id-subscribe-topic';
import { getMerossAppUserIdAppIdSubscribeTopic, IGetMerossAppUserIdAppIdSubscribeTopicOptions } from '../../shared/get-meross-app-user-id-app-id-subscribe-topic';
import { IHavingUserKey } from '../../../types/user-key.type';
import { IGenericMerossPacket } from '../meross-packet.type';
import { verifyMerossPacket } from '../verify-meross-packet';

export interface ISendMqttMerossPacketOptions extends //
  IGetMerossAppUserIdAppIdSubscribeTopicOptions,
  IGetMerossApplianceDeviceIdSubscribeTopicOptions,
  IAbortableOptions,
  IHavingUserKey
//
{
  client: IMqttClient;
  packet: IGenericMerossPacket;
}

export function sendMqttMerossPacket<GResponsePayload extends IAsyncTaskConstraint<GResponsePayload>>(
  {
    client,
    packet,
    abortable,
    userId,
    appId,
    deviceId,
    key,
  }: ISendMqttMerossPacketOptions,
): AsyncTask<GResponsePayload> {
  return new AsyncTask<GResponsePayload>((
    success: IAsyncTaskSuccessFunction<GResponsePayload>,
    error: IAsyncTaskErrorFunction,
    abortable: Abortable,
  ): void => {
    const onError = (_error: unknown): void => {
      error(_error);
    };

    const clientResponse$ = client.on(
      getMerossAppUserIdAppIdSubscribeTopic({
        userId,
        appId,
      }),
    );

    clientResponse$((
      standardMqttPublishPacket: IStandardMqttPublishPacket,
      abortable: Abortable,
    ): AsyncTask<void> => {
      const merossResponsePacket: IGenericMerossPacket = JSON.parse(standardMqttPublishPacket.payload.toString());

      if (merossResponsePacket.header.messageId === packet.header.messageId) {
        try {
          verifyMerossPacket({
            packet: merossResponsePacket,
            key,
          });
          // TODO ensure than packet is an ACK
          success(merossResponsePacket.payload);
        } catch (error: unknown) {
          onError(error);
        }
      }
      return AsyncTask.void(abortable);
    }, abortable)
      .errored(onError);

    client.publish({
      topic: getMerossApplianceDeviceIdSubscribeTopic({ deviceId }),
      payload: JSON.stringify(packet),
      abortable,
    })
      .errored(onError);
  }, abortable);
}
