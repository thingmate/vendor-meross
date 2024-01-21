import { IMerossSystemHardware } from '../../shared-types/meross-system-hardware.type';

export const MEROSS_APPLIANCE_SYSTEM_HARDWARE_ABILITY_NAME = 'Appliance.System.Hardware';

export type IMerossApplianceSystemHardwareAbilityName = typeof MEROSS_APPLIANCE_SYSTEM_HARDWARE_ABILITY_NAME;

/** GET */

export interface IMerossApplianceSystemHardwareAbilityGETPayload {

}

export interface IMerossApplianceSystemHardwareAbilityGETACKPayload {
  readonly hardware: IMerossSystemHardware;
}
