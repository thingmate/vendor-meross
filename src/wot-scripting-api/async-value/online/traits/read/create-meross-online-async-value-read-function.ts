import { Abortable, AsyncTask, asyncTaskWithTimeout, TimeoutError } from '@lirx/async-task';
import { IAsyncValueReadFunction } from '@thingmate/wot-scripting-api';
import { IMerossDeviceManager } from '../../../../../device/manager/meross-device-manager.type';
import {
  IMerossApplianceSystemFirmwareAbilityGETACKPayload,
  IMerossApplianceSystemFirmwareAbilityGETPayload,
  MEROSS_APPLIANCE_SYSTEM_FIRMWARE_ABILITY_NAME,
} from '../../../../../device/packet/abilities/abilities/appliance-system-firmware/meross-appliance-system-firmware.type';

export interface ICreateMerossOnlineAsyncValueReadFunctionOptions {
  readonly manager: IMerossDeviceManager;
  readonly timeout?: number;
}

export function createMerossOnlineAsyncValueReadFunction(
  {
    manager,
    timeout = 1000,
  }: ICreateMerossOnlineAsyncValueReadFunctionOptions,
): IAsyncValueReadFunction<boolean> {
  return (
    abortable: Abortable,
  ): AsyncTask<boolean> => {
    return asyncTaskWithTimeout((abortable: Abortable) => {
      return manager.query<IMerossApplianceSystemFirmwareAbilityGETACKPayload>({
        method: 'GET',
        namespace: MEROSS_APPLIANCE_SYSTEM_FIRMWARE_ABILITY_NAME,
        payload: {} satisfies IMerossApplianceSystemFirmwareAbilityGETPayload,
        abortable,
      });
    }, timeout, abortable)
      .then(
        (): boolean => true,
        (error: unknown): boolean | never => {
          if (error instanceof TimeoutError) {
            return false;
          } else {
            throw error;
          }
        },
      );
  };
}
