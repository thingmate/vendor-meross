import {
  createToggleOnOffStateThingActionInitOptionsFromOnOffStateThingProperty,
  IOnOffStateThingProperty,
  ToggleOnOffStateThingAction,
} from '@thingmate/wot-scripting-api';
import {
  IDeviceOptionsForCreateAndSendMerossPacketAbility,
} from '../../../device/packet/abilities/shared/device-options-for-create-and-send-meross-packet-ability';
import {
  MerossOnOffStateThingProperty,
} from '../../properties/meross-on-off-state-thing-property/meross-on-off-state-thing-property.class';

export interface IMerossToggleOnOffStateThingActionOptionsHavingDeviceOptions {
  deviceOptions: IDeviceOptionsForCreateAndSendMerossPacketAbility;
  channel?: number;
}

export interface IMerossToggleOnOffStateThingActionOptionsHavingOnOffStateThingProperty {
  onOffStateProperty: IOnOffStateThingProperty;
}

export type IMerossToggleOnOffStateThingActionOptions =
  | IMerossToggleOnOffStateThingActionOptionsHavingDeviceOptions
  | IMerossToggleOnOffStateThingActionOptionsHavingOnOffStateThingProperty
  ;

export class MerossToggleOnOffStateThingAction extends ToggleOnOffStateThingAction {
  constructor(
    options: IMerossToggleOnOffStateThingActionOptions,
  ) {
    super(
      createToggleOnOffStateThingActionInitOptionsFromOnOffStateThingProperty(
        ('onOffStateProperty' in options)
          ? options.onOffStateProperty
          : new MerossOnOffStateThingProperty({
            deviceOptions: options.deviceOptions,
            channel: options.channel ?? 0,
          }),
      ),
    );
  }
}
