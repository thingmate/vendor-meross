import { IMerossSystemFirmware } from '../../shared-types/meross-system-firmware.type';

export const MEROSS_APPLIANCE_SYSTEM_FIRMWARE_ABILITY_NAME = 'Appliance.System.Firmware';

export type IMerossApplianceSystemFirmwareAbilityName = typeof MEROSS_APPLIANCE_SYSTEM_FIRMWARE_ABILITY_NAME;

/** GET */

export interface IMerossApplianceSystemFirmwareAbilityGETPayload {
}

export interface IMerossApplianceSystemFirmwareAbilityGETACKPayload {
  readonly firmware: IMerossSystemFirmware;
}

