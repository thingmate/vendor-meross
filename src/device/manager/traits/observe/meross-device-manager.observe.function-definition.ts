import { IAsyncTaskConstraint } from '@lirx/async-task';
import { IPushSourceWithBackPressure } from '@lirx/stream';

export interface IMerossDeviceManagerObserveFunction {
  <GResponsePayload extends IAsyncTaskConstraint<GResponsePayload>>(
    namespace: string,
  ): IPushSourceWithBackPressure<GResponsePayload>;
}
