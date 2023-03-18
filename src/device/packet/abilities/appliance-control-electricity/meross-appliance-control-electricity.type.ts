import { AsyncTask } from '@lirx/async-task';
import { createAndSendMerossPacketWithTimeout } from '../../create-and-send-meross-packet-with-timeout';
import { ICreateAndSendMerossPacketOptionsForAbility } from '../shared/create-and-send-meross-packet-options-for-ability.type';
import { IMerossElectricity } from '../shared/meross-electricity.type';

export const MEROSS_APPLIANCE_CONTROL_ELECTRICITY_ABILITY_NAME = 'Appliance.Control.Electricity';

export type IMerossApplianceControlElectricityAbilityName = typeof MEROSS_APPLIANCE_CONTROL_ELECTRICITY_ABILITY_NAME;

/** GET */

export interface IMerossApplianceControlElectricityAbilityGETPayload {
  electricity: {
    channel: number;
  };
}

export interface IMerossApplianceControlElectricityAbilityGETACKPayload {
  electricity: IMerossElectricity;
}

export type IGetMerossApplianceControlElectricityOptions = ICreateAndSendMerossPacketOptionsForAbility<IMerossApplianceControlElectricityAbilityGETPayload>;

export function getMerossApplianceControlElectricity(
  options: IGetMerossApplianceControlElectricityOptions,
): AsyncTask<IMerossApplianceControlElectricityAbilityGETACKPayload> {
  return createAndSendMerossPacketWithTimeout<IMerossApplianceControlElectricityAbilityGETPayload, IMerossApplianceControlElectricityAbilityGETACKPayload>({
    method: 'GET',
    namespace: MEROSS_APPLIANCE_CONTROL_ELECTRICITY_ABILITY_NAME,
    ...options,
  });
}
