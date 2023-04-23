import { createThing, ISmartPlugConfig, IThing } from '@thingmate/wot-scripting-api';
import {
  createMerossSmartPlugConsumptionHistoryThingProperty,
  IMerossSmartPlugConsumptionHistoryThingPropertyOptions,
} from './functions/create-meross-smart-plug-consumption-history-thing-property';
import {
  createMerossSmartPlugConsumptionThingProperty,
  IMerossSmartPlugConsumptionThingProperty,
  IMerossSmartPlugConsumptionThingPropertyOptions,
} from './functions/create-meross-smart-plug-consumption-thing-property';
import {
  createMerossSmartPlugStateThingProperty,
  IMerossSmartPlugStateThingPropertyOptions,
} from './functions/create-meross-smart-plug-state-thing-property';
import {
  createMerossSmartPlugToggleThingAction,
  IMerossSmartPlugToggleThingActionOptions,
} from './functions/create-meross-smart-plug-toggle-thing-action';

export interface ICreateMerossMss310SmartPlugThingOptions extends //
  IMerossSmartPlugStateThingPropertyOptions,
  IMerossSmartPlugConsumptionThingPropertyOptions,
  IMerossSmartPlugConsumptionHistoryThingPropertyOptions,
  IMerossSmartPlugToggleThingActionOptions
//
{
}

// export interface IMerossMss310SmartPlugConfig extends ISmartPlugConfig {
//   properties: Omit<ISmartPlugConfig['properties'], 'consumption'> & {
//     consumption: IMerossSmartPlugConsumptionThingProperty;
//   };
// }

export interface IMerossMss310SmartPlugConfig extends ISmartPlugConfig {
}

export type IMerossMss310SmartPlugThing = IThing<IMerossMss310SmartPlugConfig>;

export function createMerossMss310SmartPlugThing(
  options: ICreateMerossMss310SmartPlugThingOptions,
): IMerossMss310SmartPlugThing {
  return createThing<ISmartPlugConfig>({
    properties: {
      state: createMerossSmartPlugStateThingProperty(options),
      consumption: createMerossSmartPlugConsumptionThingProperty(options),
      consumptionHistory: createMerossSmartPlugConsumptionHistoryThingProperty(options),
    },
    actions: {
      toggle: createMerossSmartPlugToggleThingAction(options),
    },
  });
}

