import { Abortable, AsyncTask } from '@lirx/async-task';
import { mapPushPipeWithBackPressure, mergePushSourceWithBackPressure } from '@lirx/stream';
import { IPushSinkWithBackPressure } from '@lirx/stream/src/push-sink/push-sink-with-back-pressure.type';
import { IPushSourceWithBackPressure } from '@lirx/stream/src/push-source/push-source-with-back-pressure.type';
import { ISmartPlugState, IThingProperty } from '@thingmate/wot-scripting-api';
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

import { merossToggleStateToSmartPlugState } from './meross-toggle-state-to-smart-plug-state';
import { standardSmartPlugStateToMerossToggleState } from './standard-smart-plug-state-to-meross-toggle-state';

export interface IMerossSmartPlugStateThingPropertyOptions {
  deviceOptions: IDeviceOptionsForCreateAndSendMerossPacketAbility;
  channel?: number;
}

export function createMerossSmartPlugStateThingProperty(
  {
    deviceOptions,
    channel = 0,
  }: IMerossSmartPlugStateThingPropertyOptions,
): IThingProperty<ISmartPlugState> {
  const read = (
    abortable: Abortable,
  ): AsyncTask<ISmartPlugState> => {
    return getMerossApplianceControlToggleX({
      ...deviceOptions,
      payload: {
        togglex: {
          channel: channel,
        },
      },
      abortable,
    })
      .successful((response: IMerossApplianceControlToggleXAbilityGETACKPayload): ISmartPlugState => {
        return merossToggleStateToSmartPlugState(response.togglex.onoff);
      });
  };

  const write = (
    value: ISmartPlugState,
    abortable: Abortable,
  ): AsyncTask<void> => {
    return setMerossApplianceControlToggleX({
      ...deviceOptions,
      payload: {
        togglex: {
          channel: channel,
          onoff: standardSmartPlugStateToMerossToggleState(value),
        },
      },
      abortable,
    })
      .successful(() => {
        // TODO emit change
      });
  };

  const observe = (): IPushSourceWithBackPressure<ISmartPlugState> => {
    const smartPlugState$ = mapPushPipeWithBackPressure(
      createMerossApplianceControlToggleXAbilityListener(deviceOptions),
      (
        payload: IMerossApplianceControlToggleXAbilityPUSHPayload,
      ): ISmartPlugState => {
        return merossToggleStateToSmartPlugState(payload.togglex[channel].onoff);
      },
    );

    // TODO create helper
    const currentSmartPlugState$$ = (sink: IPushSinkWithBackPressure<ISmartPlugState>, abortable: Abortable): AsyncTask<void> => {
      return read(abortable)
        .successful((state: ISmartPlugState, abortable: Abortable) => {
          return sink(state, abortable);
        });
    };

    return mergePushSourceWithBackPressure([
      currentSmartPlugState$$,
      smartPlugState$,
    ]);
  };

  return {
    read,
    write,
    observe,
  };
}
