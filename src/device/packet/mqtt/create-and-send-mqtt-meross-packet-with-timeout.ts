import { Abortable, AsyncTask, asyncTaskWithTimeout, IAsyncTaskConstraint } from '@lirx/async-task';
import { createAndSendMqttMerossPacket, ICreateAndSendMqttMerossPacketOptions } from './create-and-send-mqtt-meross-packet';

export interface ICreateAndSendMqttMerossPacketOptionsWithTimeout<GPayload> extends ICreateAndSendMqttMerossPacketOptions<GPayload> {
  timeout?: number;
}

export function createAndSendMqttMerossPacketWithTimeout<GRequestPayload, GResponsePayload extends IAsyncTaskConstraint<GResponsePayload>>(
  {
    abortable,
    timeout = 1000,
    ...options
  }: ICreateAndSendMqttMerossPacketOptionsWithTimeout<GRequestPayload>,
): AsyncTask<GResponsePayload> {
  return asyncTaskWithTimeout<GResponsePayload>(
    (abortable: Abortable): AsyncTask<GResponsePayload> => {
      return createAndSendMqttMerossPacket<GRequestPayload, GResponsePayload>({
        ...options,
        abortable,
      });
    },
    timeout,
    abortable,
  );
}



