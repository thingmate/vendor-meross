import { IAsyncValue } from '@thingmate/wot-scripting-api';
import {
  createMerossDescriptionAsyncValueReadFunction,
  ICreateMerossDescriptionAsyncValueReadFunctionOptions,
} from './traits/read/create-meross-description-async-value-read-function';
import { IMerossThingDescription } from './types/meross-thing-description.type';

export interface ICreateMerossDescriptionAsyncValueOptions extends //
  ICreateMerossDescriptionAsyncValueReadFunctionOptions
  //
{
}

export function createMerossDescriptionAsyncValue(
  options: ICreateMerossDescriptionAsyncValueOptions,
): IAsyncValue<IMerossThingDescription> {
  return {
    read: createMerossDescriptionAsyncValueReadFunction(options),
    write: void 0,
    observe: void 0,
  };
}

