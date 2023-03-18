import { Abortable, AsyncTask, asyncTaskWithTimeout, IAsyncTaskConstraint } from '@lirx/async-task';
import { createAndSendHttpMerossPacket, ICreateAndSendHttpMerossPacketOptions } from './create-and-send-http-meross-packet';

export interface ICreateAndSendHttpMerossPacketOptionsWithTimeout<GPayload> extends ICreateAndSendHttpMerossPacketOptions<GPayload> {
  timeout?: number;
}

export function createAndSendHttpMerossPacketWithTimeout<GRequestPayload, GResponsePayload extends IAsyncTaskConstraint<GResponsePayload>>(
  {
    abortable,
    timeout = 1000,
    ...options
  }: ICreateAndSendHttpMerossPacketOptionsWithTimeout<GRequestPayload>,
): AsyncTask<GResponsePayload> {
  return asyncTaskWithTimeout<GResponsePayload>(
    (abortable: Abortable): AsyncTask<GResponsePayload> => {
      return createAndSendHttpMerossPacket<GRequestPayload, GResponsePayload>({
        ...options,
        abortable,
      });
    },
    timeout,
    abortable,
  );
}



