import { IOnOffStateThingProperty, ISmartPlugConfig, Thing } from '@thingmate/wot-scripting-api';
import {
  createMerossOnOffStateThingProperty,
  ICreateMerossOnOffStateThingPropertyOptions,
} from './functions/create-meross-on-off-state-thing-property';
import {
  createMerossPowerConsumptionHistoryThingProperty,
  ICreateMerossPowerConsumptionHistoryThingPropertyOptions,
} from './functions/create-meross-power-consumption-history-thing-property';
import {
  createMerossPowerConsumptionThingProperty,
  ICreateMerossPowerConsumptionThingPropertyOptions,
} from './functions/create-meross-power-consumption-thing-property';
import { createMerossToggleOnOffStateThingAction } from './functions/create-meross-toggle-on-off-state-thing-action';

export interface ICreateMerossMss310SmartPlugThingOptions extends //
  ICreateMerossOnOffStateThingPropertyOptions,
  ICreateMerossPowerConsumptionThingPropertyOptions,
  ICreateMerossPowerConsumptionHistoryThingPropertyOptions
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

export type IMerossMss310SmartPlugThing = Thing<IMerossMss310SmartPlugConfig>;

export function createMerossMss310SmartPlugThing(
  options: ICreateMerossMss310SmartPlugThingOptions,
): IMerossMss310SmartPlugThing {
  const state: IOnOffStateThingProperty = createMerossOnOffStateThingProperty(options);

  return new Thing<ISmartPlugConfig>({
    properties: {
      state,
      consumption: createMerossPowerConsumptionThingProperty(options),
      consumptionHistory: createMerossPowerConsumptionHistoryThingProperty(options),
    },
    actions: {
      toggle: createMerossToggleOnOffStateThingAction({
        onOffStateProperty: state,
      }),
    },
  });
}

