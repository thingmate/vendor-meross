import { Abortable, AsyncTask } from '@lirx/async-task';
import { IOnOffState, ThingAction, IToggleOnOffStateThingAction, getOppositeOnOffState } from '@thingmate/wot-scripting-api';
import {
  IDeviceOptionsForCreateAndSendMerossPacketAbility,
} from '../../../device/packet/abilities/shared/device-options-for-create-and-send-meross-packet-ability';
import { createMerossOnOffStateThingProperty } from './create-meross-on-off-state-thing-property';

export interface ICreateMerossToggleOnOffStateThingActionOptions {
  deviceOptions: IDeviceOptionsForCreateAndSendMerossPacketAbility;
  channel?: number;
}

export function createMerossToggleOnOffStateThingAction(
  {
    deviceOptions,
    channel = 0,
  }: ICreateMerossToggleOnOffStateThingActionOptions,
): IToggleOnOffStateThingAction {
  const stateProperty = createMerossOnOffStateThingProperty({
    deviceOptions,
    channel,
  });

  const invoke = (
    value: IOnOffState | null,
    abortable: Abortable,
  ): AsyncTask<IOnOffState> => {
    const getState = (
      abortable: Abortable,
    ): AsyncTask<IOnOffState> => {
      return (value === null)
        ? stateProperty.read(abortable)
          .successful(getOppositeOnOffState)
        : AsyncTask.success(value, abortable);
    };

    return getState(abortable)
      .successful((state: IOnOffState, abortable: Abortable): AsyncTask<IOnOffState> => {
        return stateProperty.write(state, abortable)
          .successful((): IOnOffState => {
            return state;
          });
      });
  };

  return new ThingAction<IOnOffState | null, IOnOffState>({
    invoke,
  });
}
