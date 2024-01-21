import {
  DescriptionAsyncValueName,
  IHavingDescriptionAsyncValue, IHavingOnlineAsyncValue,
  IHavingOnOffAsyncValue,
  IHavingPowerConsumptionAsyncValue,
  IHavingPowerConsumptionHistoryAsyncValue, OnlineAsyncValueName,
  OnOffAsyncValueName,
  PowerConsumptionAsyncValueName,
  PowerConsumptionHistoryAsyncValueName,
} from '@thingmate/wot-scripting-api';
import {
  createMerossDescriptionAsyncValue,
  ICreateMerossDescriptionAsyncValueOptions,
} from '../../../async-value/description/meross-description-async-value';
import { IMerossThingDescription } from '../../../async-value/description/types/meross-thing-description.type';
import { createMerossOnlineAsyncValue, ICreateMerossOnlineAsyncValueOptions } from '../../../async-value/online/meross-online-async-value';
import { createMerossOnOffAsyncValue, ICreateMerossOnOffAsyncValueOptions } from '../../../async-value/onoff/meross-on-off-async-value';
import {
  createMerossPowerConsumptionHistoryAsyncValue,
  ICreateMerossPowerConsumptionHistoryAsyncValueOptions,
} from '../../../async-value/power-consumption-history/meross-power-consumption-history-async-value';
import {
  createMerossPowerConsumptionAsyncValue,
  ICreateMerossPowerConsumptionAsyncValueOptions,
} from '../../../async-value/power-consumption/meross-power-consumption-async-value';

export interface IMerossMss310SmartPlugThing extends //
  IHavingDescriptionAsyncValue<IMerossThingDescription>,
  IHavingOnlineAsyncValue,
  IHavingOnOffAsyncValue,
  IHavingPowerConsumptionAsyncValue,
  IHavingPowerConsumptionHistoryAsyncValue
//
{

}

export interface ICreateMerossMss310SmartPlugThingOptions extends //
  ICreateMerossDescriptionAsyncValueOptions,
  ICreateMerossOnlineAsyncValueOptions,
  ICreateMerossOnOffAsyncValueOptions,
  ICreateMerossPowerConsumptionAsyncValueOptions,
  ICreateMerossPowerConsumptionHistoryAsyncValueOptions
  //
{
}

export function createMerossMss310SmartPlugThing(
  options: ICreateMerossMss310SmartPlugThingOptions,
): IMerossMss310SmartPlugThing {
  return {
    [DescriptionAsyncValueName]: createMerossDescriptionAsyncValue(options),
    [OnlineAsyncValueName]: createMerossOnlineAsyncValue(options),
    [OnOffAsyncValueName]: createMerossOnOffAsyncValue(options),
    [PowerConsumptionAsyncValueName]: createMerossPowerConsumptionAsyncValue(options),
    [PowerConsumptionHistoryAsyncValueName]: createMerossPowerConsumptionHistoryAsyncValue(options),
  };
}
