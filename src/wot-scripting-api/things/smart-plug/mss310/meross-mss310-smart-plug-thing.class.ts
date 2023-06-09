import { IThingInitDescriptionOptions, SmartPlugThing } from '@thingmate/wot-scripting-api';
import {
  MerossToggleOnOffStateThingAction,
} from '../../../actions/meross-toggle-on-off-state-thing-action/meross-toggle-on-off-state-thing-action.class';
import {
  IMerossOnOffStateThingPropertyOptions,
  MerossOnOffStateThingProperty,
} from '../../../properties/meross-on-off-state-thing-property/meross-on-off-state-thing-property.class';
import {
  IMerossOnlineThingPropertyOptions,
  MerossOnlineThingProperty,
} from '../../../properties/meross-online-thing-property/meross-online-thing-property.class';
import {
  IMerossPowerConsumptionHistoryThingPropertyOptions,
  MerossPowerConsumptionHistoryThingProperty,
} from '../../../properties/meross-power-consumption-history-thing-property/meross-power-consumption-history-thing-property.class';
import {
  IMerossPowerConsumptionThingPropertyOptions,
  MerossPowerConsumptionThingProperty,
} from '../../../properties/meross-power-consumption-thing-property/meross-power-consumption-thing-property.class';

export interface ICreateMerossMss310SmartPlugThingOptions extends //
  IMerossOnlineThingPropertyOptions,
  IMerossOnOffStateThingPropertyOptions,
  IMerossPowerConsumptionThingPropertyOptions,
  IMerossPowerConsumptionHistoryThingPropertyOptions,
  IThingInitDescriptionOptions
//
{
}

export class MerossMss310SmartPlugThing extends SmartPlugThing {
  constructor(
    options: ICreateMerossMss310SmartPlugThingOptions,
  ) {
    const state = new MerossOnOffStateThingProperty(options);

    super({
      description: options.description,
      properties: {
        online: new MerossOnlineThingProperty(options),
        state,
        consumption: new MerossPowerConsumptionThingProperty(options),
        consumptionHistory: new MerossPowerConsumptionHistoryThingProperty(options),
      },
      actions: {
        toggle: new MerossToggleOnOffStateThingAction({
          onOffStateProperty: state,
        }),
      },
    });
  }
}
