import { AsyncTask, IAsyncTaskConstraint } from '@lirx/async-task';
import { createMerossPacket, ICreateMerossPacketOptions } from '../create-meross-packet';
import { ISendMqttMerossPacketOptions, sendMqttMerossPacket } from './send-mqtt-meross-packet';

export interface ICreateAndSendMqttMerossPacketOptions<GPayload> extends //
  ICreateMerossPacketOptions<GPayload>,
  Omit<ISendMqttMerossPacketOptions, 'packet'>
//
{
}

export function createAndSendMqttMerossPacket<GRequestPayload, GResponsePayload extends IAsyncTaskConstraint<GResponsePayload>>(
  options: ICreateAndSendMqttMerossPacketOptions<GRequestPayload>,
): AsyncTask<GResponsePayload> {
  return sendMqttMerossPacket<GResponsePayload>({
    ...options,
    packet: createMerossPacket<GRequestPayload>(options),
  });
}
