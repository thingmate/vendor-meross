import { Abortable, AsyncTask } from '@lirx/async-task';
import { IAsyncValueReadFunction, IOnOff } from '@thingmate/wot-scripting-api';
import { IMerossDeviceManager } from '../../../../../device/manager/meross-device-manager.type';
import {
  IMerossApplianceControlToggleXAbilityGETACKPayload,
  IMerossApplianceControlToggleXAbilityGETPayload,
  MEROSS_APPLIANCE_CONTROL_TOGGLE_X_ABILITY_NAME,
} from '../../../../../device/packet/abilities/abilities/appliance-control-toggle-x/meross-appliance-control-toggle-x.type';
import { merossToggleStateToOnOffState } from '../../functions/meross-toggle-state-to-on-off-state';

export interface ICreateMerossOnOffAsyncValueReadFunctionOptions {
  readonly manager: IMerossDeviceManager;
  readonly channel?: number;
}

export function createMerossOnOffAsyncValueReadFunction(
  {
    manager,
    channel = 0,
  }: ICreateMerossOnOffAsyncValueReadFunctionOptions,
): IAsyncValueReadFunction<IOnOff> {
  return (
    abortable: Abortable,
  ): AsyncTask<IOnOff> => {
    return manager.query<IMerossApplianceControlToggleXAbilityGETACKPayload>({
      method: 'GET',
      namespace: MEROSS_APPLIANCE_CONTROL_TOGGLE_X_ABILITY_NAME,
      payload: {
        togglex: {
          channel,
        },
      } satisfies IMerossApplianceControlToggleXAbilityGETPayload,
      abortable,
    })
      .successful((response: IMerossApplianceControlToggleXAbilityGETACKPayload): IOnOff => {
        return merossToggleStateToOnOffState(response.togglex.onoff);
      });
  };
}
