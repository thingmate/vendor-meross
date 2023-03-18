import { Abortable, AsyncTask, asyncTaskWithTimeout, IAsyncTaskConstraint } from '@lirx/async-task';
import { createAndSendMerossPacket, ICreateAndSendMerossPacketOptions } from './create-and-send-meross-packet';

export interface ICreateAndSendMerossPacketWithTimeoutOptions<GPayload> extends ICreateAndSendMerossPacketOptions<GPayload> {
  timeout?: number;
}

export function createAndSendMerossPacketWithTimeout<GRequestPayload, GResponsePayload extends IAsyncTaskConstraint<GResponsePayload>>(
  {
    timeout = 2000,
    abortable,
    ...options
  }: ICreateAndSendMerossPacketWithTimeoutOptions<GRequestPayload>,
): AsyncTask<GResponsePayload> {
  return asyncTaskWithTimeout<GResponsePayload>(
    (abortable: Abortable): AsyncTask<GResponsePayload> => {
      return createAndSendMerossPacket<GRequestPayload, GResponsePayload>({
        ...options,
        abortable,
      });
    },
    timeout,
    abortable,
  );
}
