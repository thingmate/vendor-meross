import { Abortable, AsyncTask } from '@lirx/async-task';
import { IAsyncValueReadFunction } from '@thingmate/wot-scripting-api';
import { IMerossDeviceListResponseDataDeviceJSON } from '../../../../../api/get-meross-device-list';
import {
  convertMerossDeviceDetailsJSONToMerossThingDescription,
} from '../../functions/convert-meross-device-details-json-to-meross-thing-description';
import { IMerossThingDescription } from '../../types/meross-thing-description.type';

export interface ICreateMerossDescriptionAsyncValueReadFunctionOptions {
  readonly device: IMerossDeviceListResponseDataDeviceJSON;
}

export function createMerossDescriptionAsyncValueReadFunction(
  {
    device,
  }: ICreateMerossDescriptionAsyncValueReadFunctionOptions,
): IAsyncValueReadFunction<IMerossThingDescription> {
  const description: IMerossThingDescription = convertMerossDeviceDetailsJSONToMerossThingDescription(device);
  return (
    abortable: Abortable,
  ): AsyncTask<IMerossThingDescription> => {
    return AsyncTask.success<IMerossThingDescription>(description, abortable);
  };
}
