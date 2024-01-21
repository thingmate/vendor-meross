import { IAsyncValue, IOnOff } from '@thingmate/wot-scripting-api';
import {
  createMerossOnOffAsyncValueObserveFunction,
  ICreateMerossOnOffAsyncValueObserveFunctionOptions,
} from './traits/observe/create-meross-on-off-async-value-observe-function';
import {
  createMerossOnOffAsyncValueReadFunction,
  ICreateMerossOnOffAsyncValueReadFunctionOptions,
} from './traits/read/create-meross-on-off-async-value-read-function';
import {
  createMerossOnOffAsyncValueWriteFunction,
  ICreateMerossOnOffAsyncValueWriteFunctionOptions,
} from './traits/write/create-meross-on-off-async-value-write-function';


export interface ICreateMerossOnOffAsyncValueOptions extends //
  ICreateMerossOnOffAsyncValueReadFunctionOptions,
  ICreateMerossOnOffAsyncValueWriteFunctionOptions,
  ICreateMerossOnOffAsyncValueObserveFunctionOptions
  //
{
}

export function createMerossOnOffAsyncValue(
  options: ICreateMerossOnOffAsyncValueOptions,
): IAsyncValue<IOnOff> {
  return {
    read: createMerossOnOffAsyncValueReadFunction(options),
    write: createMerossOnOffAsyncValueWriteFunction(options),
    observe: createMerossOnOffAsyncValueObserveFunction(options),
  };
}

