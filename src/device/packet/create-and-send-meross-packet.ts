import { AsyncTask, IAsyncTaskConstraint } from '@lirx/async-task';
import { createMerossPacket, ICreateMerossPacketOptions } from './create-meross-packet';
import { ISendMerossPacketOptions, sendMerossPacket } from './send-meross-packet';

export interface ICreateAndSendMerossPacketOptions<GPayload> extends //
  ICreateMerossPacketOptions<GPayload>,
  Omit<ISendMerossPacketOptions, 'packet'>
//
{
}

export function createAndSendMerossPacket<GRequestPayload, GResponsePayload extends IAsyncTaskConstraint<GResponsePayload>>(
  options: ICreateAndSendMerossPacketOptions<GRequestPayload>,
): AsyncTask<GResponsePayload> {
  return sendMerossPacket<GResponsePayload>({
    ...options,
    packet: createMerossPacket<GRequestPayload>(options),
  });
}


