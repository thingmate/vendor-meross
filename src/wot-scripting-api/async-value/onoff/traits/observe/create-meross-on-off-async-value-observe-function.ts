import { mapPushPipeWithBackPressure, sharePushPipeWithBackPressure } from '@lirx/stream';
import { IAsyncValueObserveFunction, IOnOff } from '@thingmate/wot-scripting-api';
import { IMerossDeviceManager } from '../../../../../device/manager/meross-device-manager.type';
import {
  IMerossApplianceControlToggleXAbilityPUSHPayload,
  MEROSS_APPLIANCE_CONTROL_TOGGLE_X_ABILITY_NAME,
} from '../../../../../device/packet/abilities/abilities/appliance-control-toggle-x/meross-appliance-control-toggle-x.type';
import { merossToggleStateToOnOffState } from '../../functions/meross-toggle-state-to-on-off-state';

export interface ICreateMerossOnOffAsyncValueObserveFunctionOptions {
  readonly manager: IMerossDeviceManager;
  readonly channel?: number;
}

export function createMerossOnOffAsyncValueObserveFunction(
  {
    channel = 0,
    manager,
  }: ICreateMerossOnOffAsyncValueObserveFunctionOptions,
): IAsyncValueObserveFunction<IOnOff> {
  return sharePushPipeWithBackPressure<IOnOff>(
    mapPushPipeWithBackPressure<IMerossApplianceControlToggleXAbilityPUSHPayload, IOnOff>(
      manager.observe<IMerossApplianceControlToggleXAbilityPUSHPayload>(MEROSS_APPLIANCE_CONTROL_TOGGLE_X_ABILITY_NAME),
      (payload: IMerossApplianceControlToggleXAbilityPUSHPayload): IOnOff => {
        return merossToggleStateToOnOffState(payload.togglex[channel].onoff);
      },
    ),
  );
}
