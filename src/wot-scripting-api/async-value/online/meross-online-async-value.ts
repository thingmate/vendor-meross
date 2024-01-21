import { IAsyncValue } from '@thingmate/wot-scripting-api';
import {
  createMerossOnlineAsyncValueReadFunction,
  ICreateMerossOnlineAsyncValueReadFunctionOptions,
} from './traits/read/create-meross-online-async-value-read-function';

export interface ICreateMerossOnlineAsyncValueOptions extends //
  ICreateMerossOnlineAsyncValueReadFunctionOptions
  //
{
}

export function createMerossOnlineAsyncValue(
  options: ICreateMerossOnlineAsyncValueOptions,
): IAsyncValue<boolean> {
  return {
    read: createMerossOnlineAsyncValueReadFunction(options),
    write: void 0,
    observe: void 0,
  };
}

