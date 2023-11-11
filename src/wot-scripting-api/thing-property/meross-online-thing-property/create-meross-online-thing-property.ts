import { Abortable, AsyncTask } from '@lirx/async-task';
import { IOnlineThingProperty } from '@thingmate/wot-scripting-api';
import {
  IDeviceOptionsForCreateAndSendMerossPacketAbility,
} from '../../../device/packet/abilities/shared/device-options-for-create-and-send-meross-packet-ability';

export interface ICreateMerossOnlineThingPropertyOptions {
  deviceOptions: IDeviceOptionsForCreateAndSendMerossPacketAbility;
}

export function createMerossOnlineThingProperty(
  {
    deviceOptions,
  }: ICreateMerossOnlineThingPropertyOptions,
): IOnlineThingProperty {

  const read = (
    abortable: Abortable,
  ): AsyncTask<boolean> => {
    // TODO
    return AsyncTask.success(true, abortable);
  };

  return {
    read,
  };
}
