import { Abortable, AsyncTask } from '@lirx/async-task';
import { IPushSourceWithBackPressure, mapPushPipeWithBackPressure } from '@lirx/stream';
import { IOnOffState, OnOffStateThingProperty } from '@thingmate/wot-scripting-api';
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

export interface IMerossOnOffStateThingPropertyOptions {
  deviceOptions: IDeviceOptionsForCreateAndSendMerossPacketAbility;
  channel?: number;
}

export class MerossOnOffStateThingProperty extends OnOffStateThingProperty {
  constructor(
    {
      deviceOptions,
      channel = 0,
    }: IMerossOnOffStateThingPropertyOptions,
  ) {

    const read = (
      abortable: Abortable,
    ): AsyncTask<IOnOffState> => {
      return getMerossApplianceControlToggleX({
        ...deviceOptions,
        payload: {
          togglex: {
            channel: channel,
          },
        },
        abortable,
      })
        .successful((response: IMerossApplianceControlToggleXAbilityGETACKPayload): IOnOffState => {
          return merossToggleStateToOnOffState(response.togglex.onoff);
        });
    };

    const write = (
      value: IOnOffState,
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

    const observe = (): IPushSourceWithBackPressure<IOnOffState> => {
      return mapPushPipeWithBackPressure(
        createMerossApplianceControlToggleXAbilityListener(deviceOptions),
        (
          payload: IMerossApplianceControlToggleXAbilityPUSHPayload,
        ): IOnOffState => {
          return merossToggleStateToOnOffState(payload.togglex[channel].onoff);
        },
      );
    };

    super({
      read,
      write,
      observe,
    });
  }
}
