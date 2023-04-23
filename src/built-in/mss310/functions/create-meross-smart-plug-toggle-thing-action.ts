import { Abortable, AsyncTask } from '@lirx/async-task';
import { getOppositeSmartPlugState, ISmartPlugState, IThingAction } from '@thingmate/wot-scripting-api';
import {
  IDeviceOptionsForCreateAndSendMerossPacketAbility,
} from '../../../device/packet/abilities/shared/device-options-for-create-and-send-meross-packet-ability';
import { createMerossSmartPlugStateThingProperty } from './create-meross-smart-plug-state-thing-property';

export interface IMerossSmartPlugToggleThingActionOptions {
  deviceOptions: IDeviceOptionsForCreateAndSendMerossPacketAbility;
  channel?: number;
}

export function createMerossSmartPlugToggleThingAction(
  {
    deviceOptions,
    channel = 0,
  }: IMerossSmartPlugToggleThingActionOptions,
): IThingAction<ISmartPlugState | null, ISmartPlugState> {
  const stateProperty = createMerossSmartPlugStateThingProperty({
    deviceOptions,
    channel,
  });

  const invoke = (
    value: ISmartPlugState | null,
    abortable: Abortable,
  ): AsyncTask<ISmartPlugState> => {
    const getState = (
      abortable: Abortable,
    ): AsyncTask<ISmartPlugState> => {
      return (value === null)
        ? stateProperty.read(abortable)
          .successful(getOppositeSmartPlugState)
        : AsyncTask.success(value, abortable);
    };

    return getState(abortable)
      .successful((state: ISmartPlugState, abortable: Abortable): AsyncTask<ISmartPlugState> => {
        return stateProperty.write(state, abortable)
          .successful((): ISmartPlugState => {
            return state;
          });
      });
  };

  return {
    invoke,
  };
}
