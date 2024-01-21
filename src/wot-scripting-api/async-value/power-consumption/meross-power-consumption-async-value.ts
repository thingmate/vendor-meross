import { IAsyncValue, IPowerConsumption } from '@thingmate/wot-scripting-api';
import {
  createMerossPowerConsumptionAsyncValueReadFunction,
  ICreateMerossPowerConsumptionAsyncValueReadFunctionOptions,
} from './traits/read/create-meross-power-consumption-async-value-read-function';

export interface ICreateMerossPowerConsumptionAsyncValueOptions extends //
  ICreateMerossPowerConsumptionAsyncValueReadFunctionOptions
  //
{
}

export function createMerossPowerConsumptionAsyncValue(
  options: ICreateMerossPowerConsumptionAsyncValueOptions,
): IAsyncValue<IPowerConsumption> {
  return {
    read: createMerossPowerConsumptionAsyncValueReadFunction(options),
    write: void 0,
    observe: void 0,
  };
}

