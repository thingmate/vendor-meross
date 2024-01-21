import { IMerossElectricityConsumption } from '../../shared-types/meross-electricity-consumption.type';

export const MEROSS_APPLIANCE_CONTROL_CONSUMPTION_X_ABILITY_NAME = 'Appliance.Control.ConsumptionX';

export type IMerossApplianceControlConsumptionXAbilityName = typeof MEROSS_APPLIANCE_CONTROL_CONSUMPTION_X_ABILITY_NAME;

/** GET */

export interface IMerossApplianceControlConsumptionXAbilityGETPayload {
}

export interface IMerossApplianceControlConsumptionXAbilityGETACKPayload {
  readonly consumptionx: IMerossElectricityConsumption[];
}
