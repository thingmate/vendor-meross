import { Abortable, AsyncTask } from '@lirx/async-task';
import { IAsyncValueWriteFunction, IOnOff } from '@thingmate/wot-scripting-api';
import { IMerossDeviceManager } from '../../../../../device/manager/meross-device-manager.type';
import {
  IMerossApplianceControlToggleXAbilitySETACKPayload,
  IMerossApplianceControlToggleXAbilitySETPayload,
  MEROSS_APPLIANCE_CONTROL_TOGGLE_X_ABILITY_NAME,
} from '../../../../../device/packet/abilities/abilities/appliance-control-toggle-x/meross-appliance-control-toggle-x.type';
import { onOffStateToMerossToggleState } from '../../functions/on-off-state-to-meross-toggle-state';

export interface ICreateMerossOnOffAsyncValueWriteFunctionOptions {
  readonly manager: IMerossDeviceManager;
  readonly channel?: number;
}

export function createMerossOnOffAsyncValueWriteFunction(
  {
    channel = 0,
    manager,
  }: ICreateMerossOnOffAsyncValueWriteFunctionOptions,
): IAsyncValueWriteFunction<IOnOff> {
  return (
    value: IOnOff,
    abortable: Abortable,
  ): AsyncTask<void> => {
    return manager.query<IMerossApplianceControlToggleXAbilitySETACKPayload>({
      method: 'SET',
      namespace: MEROSS_APPLIANCE_CONTROL_TOGGLE_X_ABILITY_NAME,
      payload: {
        togglex: {
          channel,
          onoff: onOffStateToMerossToggleState(value),
        },
      } satisfies IMerossApplianceControlToggleXAbilitySETPayload,
      abortable,
    });
  };
}
