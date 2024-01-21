import { IMerossElectricity } from '../../shared-types/meross-electricity.type';

export const MEROSS_APPLIANCE_CONTROL_ELECTRICITY_ABILITY_NAME = 'Appliance.Control.Electricity';

export type IMerossApplianceControlElectricityAbilityName = typeof MEROSS_APPLIANCE_CONTROL_ELECTRICITY_ABILITY_NAME;

/** GET */

export interface IMerossApplianceControlElectricityAbilityGETPayload {
  readonly electricity: {
    readonly channel: number;
  };
}

export interface IMerossApplianceControlElectricityAbilityGETACKPayload {
  readonly electricity: IMerossElectricity;
}

