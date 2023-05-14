import { Abortable, AsyncTask } from '@lirx/async-task';
import { mapPushPipeWithBackPressure, mergePushSourceWithBackPressure, IPushSourceWithBackPressure, IPushSinkWithBackPressure } from '@lirx/stream';
import { IOnOffState, ThingProperty, IOnOffStateThingProperty } from '@thingmate/wot-scripting-api';
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

import { merossToggleStateToOnOffState } from './meross-toggle-state-to-on-off-state';
import { onOffStateToMerossToggleState } from './on-off-state-to-meross-toggle-state';

export interface ICreateMerossOnOffStateThingPropertyOptions {
  deviceOptions: IDeviceOptionsForCreateAndSendMerossPacketAbility;
  channel?: number;
}

export function createMerossOnOffStateThingProperty(
  {
    deviceOptions,
    channel = 0,
  }: ICreateMerossOnOffStateThingPropertyOptions,
): IOnOffStateThingProperty {

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
    })
      .successful(() => {
        // TODO emit change
      });
  };

  const observe = (): IPushSourceWithBackPressure<IOnOffState> => {
    const smartPlugState$ = mapPushPipeWithBackPressure(
      createMerossApplianceControlToggleXAbilityListener(deviceOptions),
      (
        payload: IMerossApplianceControlToggleXAbilityPUSHPayload,
      ): IOnOffState => {
        return merossToggleStateToOnOffState(payload.togglex[channel].onoff);
      },
    );

    // TODO create helper
    const currentSmartPlugState$$ = (sink: IPushSinkWithBackPressure<IOnOffState>, abortable: Abortable): AsyncTask<void> => {
      return read(abortable)
        .successful((state: IOnOffState, abortable: Abortable) => {
          return sink(state, abortable);
        });
    };

    return mergePushSourceWithBackPressure([
      currentSmartPlugState$$,
      smartPlugState$,
    ]);
  };

  return new ThingProperty<IOnOffState>({
    read,
    write,
    observe,
  });
}
