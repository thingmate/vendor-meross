import { AsyncTask } from '@lirx/async-task';
import { createAndSendMerossPacketWithTimeout } from '../../create-and-send-meross-packet-with-timeout';
import {
  ICreateAndSendMerossPacketOptionsForAbilityWithOptionalPayload,
} from '../shared/create-and-send-meross-packet-options-for-ability.type';
import { IMerossSystemHardware } from '../shared/meross-system-hardware.type';

export const MEROSS_APPLIANCE_SYSTEM_HARDWARE_ABILITY_NAME = 'Appliance.System.Hardware';

export type IMerossApplianceSystemHardwareAbilityName = typeof MEROSS_APPLIANCE_SYSTEM_HARDWARE_ABILITY_NAME;

/** GET */

export interface IMerossApplianceSystemHardwareAbilityGETPayload {

}

export interface IMerossApplianceSystemHardwareAbilityGETACKPayload {
  hardware: IMerossSystemHardware;
}

export type IGetMerossApplianceSystemHardwareOptions = ICreateAndSendMerossPacketOptionsForAbilityWithOptionalPayload<IMerossApplianceSystemHardwareAbilityGETPayload>;

export function getMerossApplianceSystemHardware(
  options: IGetMerossApplianceSystemHardwareOptions,
): AsyncTask<IMerossApplianceSystemHardwareAbilityGETACKPayload> {
  return createAndSendMerossPacketWithTimeout<IMerossApplianceSystemHardwareAbilityGETPayload, IMerossApplianceSystemHardwareAbilityGETACKPayload>({
    method: 'GET',
    namespace: MEROSS_APPLIANCE_SYSTEM_HARDWARE_ABILITY_NAME,
    payload: {},
    ...options,
  });
}
