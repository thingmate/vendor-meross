import { AsyncTask, IAsyncTaskConstraint } from '@lirx/async-task';
import { createMerossPacket, ICreateMerossPacketOptions } from '../create-meross-packet';
import { ISendHttpMerossPacketOptions, sendHttpMerossPacket } from './send-http-meross-packet';

export interface ICreateAndSendHttpMerossPacketOptions<GPayload> extends //
  ICreateMerossPacketOptions<GPayload>,
  Omit<ISendHttpMerossPacketOptions, 'packet'>
//
{
}

export function createAndSendHttpMerossPacket<GRequestPayload, GResponsePayload extends IAsyncTaskConstraint<GResponsePayload>>(
  options: ICreateAndSendHttpMerossPacketOptions<GRequestPayload>,
): AsyncTask<GResponsePayload> {
  return sendHttpMerossPacket<GResponsePayload>({
    ...options,
    packet: createMerossPacket<GRequestPayload>(options),
  });
}


