import {
  createToggleOnOffStateThingActionFromOnOffStateThingProperty,
  IOnOffStateThingProperty,
  IToggleOnOffStateThingAction,
} from '@thingmate/wot-scripting-api';
import {
  IDeviceOptionsForCreateAndSendMerossPacketAbility,
} from '../../../device/packet/abilities/shared/device-options-for-create-and-send-meross-packet-ability';
import { createMerossOnOffStateThingProperty } from './create-meross-on-off-state-thing-property';

export interface ICreateMerossToggleOnOffStateThingActionOptionsHavingDeviceOptions {
  deviceOptions: IDeviceOptionsForCreateAndSendMerossPacketAbility;
  channel?: number;
}

export interface ICreateMerossToggleOnOffStateThingActionOptionsHavingOnOffStateThingProperty {
  onOffStateProperty: IOnOffStateThingProperty;
}

export type ICreateMerossToggleOnOffStateThingActionOptions =
  | ICreateMerossToggleOnOffStateThingActionOptionsHavingDeviceOptions
  | ICreateMerossToggleOnOffStateThingActionOptionsHavingOnOffStateThingProperty
  ;

export function createMerossToggleOnOffStateThingAction(
  options: ICreateMerossToggleOnOffStateThingActionOptions,
): IToggleOnOffStateThingAction {
  return createToggleOnOffStateThingActionFromOnOffStateThingProperty(
    ('onOffStateProperty' in options)
      ? options.onOffStateProperty
      : createMerossOnOffStateThingProperty({
        deviceOptions: options.deviceOptions,
        channel: options.channel ?? 0,
      }),
  );
}
