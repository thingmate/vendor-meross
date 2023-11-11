import { Abortable, AsyncTask } from '@lirx/async-task';
import { mapPushPipeWithBackPressure } from '@lirx/stream';
import { IOnOff, IOnOffThingProperty } from '@thingmate/wot-scripting-api';
import {
  createMerossApplianceControlToggleXAbilityListener,
  getMerossApplianceControlToggleX,
  IMerossApplianceControlToggleXAbilityGETACKPayload,
  IMerossApplianceControlToggleXAbilityPUSHPayload,
  setMerossApplianceControlToggleX,
} from '../../../device/packet/abilities/appliance-control-toggle-x/meross-appliance-control-toggle-x.type';
import {
  IDeviceOptionsForCreateAndSendMerossPacketAbility,
} from '../../../device/packet/abilities/shared/device-options-for-create-and-send-meross-packet-ability';

import { merossToggleStateToOnOffState } from '../../shared/on-off-state/meross-toggle-state-to-on-off-state';
import { onOffStateToMerossToggleState } from '../../shared/on-off-state/on-off-state-to-meross-toggle-state';

export interface ICreateMerossOnOffThingPropertyOptions {
  deviceOptions: IDeviceOptionsForCreateAndSendMerossPacketAbility;
  channel?: number;
}

export function createMerossOnOffThingProperty(
  {
    deviceOptions,
    channel = 0,
  }: ICreateMerossOnOffThingPropertyOptions,
): IOnOffThingProperty {

  const read = (
    abortable: Abortable,
  ): AsyncTask<IOnOff> => {
    return getMerossApplianceControlToggleX({
      ...deviceOptions,
      payload: {
        togglex: {
          channel: channel,
        },
      },
      abortable,
    })
      .successful((response: IMerossApplianceControlToggleXAbilityGETACKPayload): IOnOff => {
        return merossToggleStateToOnOffState(response.togglex.onoff);
      });
  };

  const write = (
    value: IOnOff,
    abortable: Abortable,
  ): AsyncTask<void> => {
    return setMerossApplianceControlToggleX({
      ...deviceOptions,
      payload: {
        togglex: {
          channel: channel,
          onoff: onOffStateToMerossToggleState(value),
        },
      },
      abortable,
    });
  };

  const observe = mapPushPipeWithBackPressure(
    createMerossApplianceControlToggleXAbilityListener(deviceOptions),
    (
      payload: IMerossApplianceControlToggleXAbilityPUSHPayload,
    ): IOnOff => {
      return merossToggleStateToOnOffState(payload.togglex[channel].onoff);
    },
  );

  return {
    read,
    write,
    observe,
  };
}
