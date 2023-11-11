import { IHavingThingDescription, ISmartPlugThing } from '@thingmate/wot-scripting-api';
import {
  createMerossOnOffThingProperty,
  ICreateMerossOnOffThingPropertyOptions,
} from '../../../thing-property/meross-on-off-thing-property/create-meross-on-off-thing-property';
import {
  createMerossOnlineThingProperty,
  ICreateMerossOnlineThingPropertyOptions,
} from '../../../thing-property/meross-online-thing-property/create-meross-online-thing-property';
import {
  createMerossPowerConsumptionHistoryThingProperty,
  ICreateMerossPowerConsumptionHistoryThingPropertyOptions,
} from '../../../thing-property/meross-power-consumption-history-thing-property/create-meross-power-consumption-history-thing-property';
import {
  createMerossPowerConsumptionThingProperty,
  ICreateMerossPowerConsumptionThingPropertyOptions,
} from '../../../thing-property/meross-power-consumption-thing-property/meross-power-consumption-thing-property.class';
import { IMerossThingDescription } from '../../types/meross-thing-description.type';

export interface ICreateMerossMss310SmartPlugThingOptions extends //
  ICreateMerossOnlineThingPropertyOptions,
  ICreateMerossOnOffThingPropertyOptions,
  ICreateMerossPowerConsumptionThingPropertyOptions,
  ICreateMerossPowerConsumptionHistoryThingPropertyOptions,
  IHavingThingDescription<IMerossThingDescription>
//
{
}

export type IMerossSmartPlugThing = ISmartPlugThing<IMerossThingDescription>;

export function createMerossMss310SmartPlugThing(
  options: ICreateMerossMss310SmartPlugThingOptions,
): IMerossSmartPlugThing {
  return {
    description: options.description,
    properties: {
      online: createMerossOnlineThingProperty(options),
      onoff: createMerossOnOffThingProperty(options),
      consumption: createMerossPowerConsumptionThingProperty(options),
      consumptionHistory: createMerossPowerConsumptionHistoryThingProperty(options),
    },
  };
}
