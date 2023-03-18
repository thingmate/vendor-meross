import { AsyncTask } from '@lirx/async-task';
import { createAndSendMerossPacketWithTimeout } from '../../create-and-send-meross-packet-with-timeout';
import {
  ICreateAndSendMerossPacketOptionsForAbilityWithOptionalPayload,
} from '../shared/create-and-send-meross-packet-options-for-ability.type';
import { IMerossSystemFirmware } from '../shared/meross-system-firmware.type';

export const MEROSS_APPLIANCE_SYSTEM_FIRMWARE_ABILITY_NAME = 'Appliance.System.Firmware';

export type IMerossApplianceSystemFirmwareAbilityName = typeof MEROSS_APPLIANCE_SYSTEM_FIRMWARE_ABILITY_NAME;

/** GET */

export interface IMerossApplianceSystemFirmwareAbilityGETPayload {

}

export interface IMerossApplianceSystemFirmwareAbilityGETACKPayload {
  firmware: IMerossSystemFirmware;
}

export type IGetMerossApplianceSystemFirmwareOptions = ICreateAndSendMerossPacketOptionsForAbilityWithOptionalPayload<IMerossApplianceSystemFirmwareAbilityGETPayload>;

export function getMerossApplianceSystemFirmware(
  options: IGetMerossApplianceSystemFirmwareOptions,
): AsyncTask<IMerossApplianceSystemFirmwareAbilityGETACKPayload> {
  return createAndSendMerossPacketWithTimeout<IMerossApplianceSystemFirmwareAbilityGETPayload, IMerossApplianceSystemFirmwareAbilityGETACKPayload>({
    method: 'GET',
    namespace: MEROSS_APPLIANCE_SYSTEM_FIRMWARE_ABILITY_NAME,
    payload: {},
    ...options,
  });
}
