import { AsyncTask, IAbortableOptions, IAsyncTaskConstraint } from '@lirx/async-task';
import { IMerossPacketMethod } from '../../../packet/meross-packet.type';

export interface IMerossDeviceManagerQueryOptions extends IAbortableOptions {
  readonly method: IMerossPacketMethod;
  readonly namespace: string;
  readonly payload: any;
}

export interface IMerossDeviceManagerQueryFunction {
  <GResponsePayload extends IAsyncTaskConstraint<GResponsePayload>>(
    {
      method,
      namespace,
      payload,
      abortable,
    }: IMerossDeviceManagerQueryOptions,
  ): AsyncTask<GResponsePayload>;
}
