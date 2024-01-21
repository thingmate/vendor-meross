import { IAsyncValue, IPowerConsumptionHistory } from '@thingmate/wot-scripting-api';
import {
  createMerossPowerConsumptionHistoryAsyncValueReadFunction,
  ICreateMerossPowerConsumptionHistoryAsyncValueReadFunctionOptions,
} from './traits/read/create-meross-power-consumption-history-async-value-read-function';

export interface ICreateMerossPowerConsumptionHistoryAsyncValueOptions extends //
  ICreateMerossPowerConsumptionHistoryAsyncValueReadFunctionOptions
  //
{
}

export function createMerossPowerConsumptionHistoryAsyncValue(
  options: ICreateMerossPowerConsumptionHistoryAsyncValueOptions,
): IAsyncValue<readonly IPowerConsumptionHistory[]> {
  return {
    read: createMerossPowerConsumptionHistoryAsyncValueReadFunction(options),
    write: void 0,
    observe: void 0,
  };
}

