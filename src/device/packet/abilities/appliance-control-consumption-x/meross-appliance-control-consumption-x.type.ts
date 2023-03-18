import { AsyncTask } from '@lirx/async-task';
import { createAndSendMerossPacketWithTimeout } from '../../create-and-send-meross-packet-with-timeout';
import {
  ICreateAndSendMerossPacketOptionsForAbilityWithOptionalPayload,
} from '../shared/create-and-send-meross-packet-options-for-ability.type';
import { IMerossElectricityConsumption } from '../shared/meross-electricity-consumption.type';

export const MEROSS_APPLIANCE_CONTROL_CONSUMPTION_X_ABILITY_NAME = 'Appliance.Control.ConsumptionX';

export type IMerossApplianceControlConsumptionXAbilityName = typeof MEROSS_APPLIANCE_CONTROL_CONSUMPTION_X_ABILITY_NAME;

/** GET */

export interface IMerossApplianceControlConsumptionXAbilityGETPayload {
}

export interface IMerossApplianceControlConsumptionXAbilityGETACKPayload {
  consumptionx: IMerossElectricityConsumption[];
}

export type IGetMerossApplianceControlConsumptionXOptions = ICreateAndSendMerossPacketOptionsForAbilityWithOptionalPayload<IMerossApplianceControlConsumptionXAbilityGETPayload>;

export function getMerossApplianceControlConsumptionX(
  options: IGetMerossApplianceControlConsumptionXOptions,
): AsyncTask<IMerossApplianceControlConsumptionXAbilityGETACKPayload> {
  return createAndSendMerossPacketWithTimeout<IMerossApplianceControlConsumptionXAbilityGETPayload, IMerossApplianceControlConsumptionXAbilityGETACKPayload>({
    method: 'GET',
    namespace: MEROSS_APPLIANCE_CONTROL_CONSUMPTION_X_ABILITY_NAME,
    payload: {},
    ...options,
  });
}
