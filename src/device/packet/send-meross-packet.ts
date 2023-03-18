import { AsyncTask, IAsyncTaskConstraint } from '@lirx/async-task';
import { ISendHttpMerossPacketOptions, sendHttpMerossPacket } from './http/send-http-meross-packet';
import { ISendMqttMerossPacketOptions, sendMqttMerossPacket } from './mqtt/send-mqtt-meross-packet';

export interface ISendMerossPacketOptions extends //
  Omit<ISendHttpMerossPacketOptions, 'hostname'>,
  Partial<Pick<ISendHttpMerossPacketOptions, 'hostname'>>,
  ISendMqttMerossPacketOptions {
}

export function sendMerossPacket<GResponsePayload extends IAsyncTaskConstraint<GResponsePayload>>(
  options: ISendMerossPacketOptions,
): AsyncTask<GResponsePayload> {
  if (options.hostname === void 0) {
    return sendMqttMerossPacket<GResponsePayload>(options);
  } else {
    return sendHttpMerossPacket<GResponsePayload>(options as ISendHttpMerossPacketOptions)
      .errored((): AsyncTask<GResponsePayload> => {
        return sendMqttMerossPacket<GResponsePayload>(options);
      });
  }
}
