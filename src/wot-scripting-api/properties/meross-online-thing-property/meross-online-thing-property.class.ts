import { Abortable, AsyncTask } from '@lirx/async-task';
import { OnlineThingProperty } from '@thingmate/wot-scripting-api';
import {
  IDeviceOptionsForCreateAndSendMerossPacketAbility,
} from '../../../device/packet/abilities/shared/device-options-for-create-and-send-meross-packet-ability';

export interface IMerossOnlineThingPropertyOptions {
  deviceOptions: IDeviceOptionsForCreateAndSendMerossPacketAbility;
}

export class MerossOnlineThingProperty extends OnlineThingProperty {
  constructor(
    {
      deviceOptions,
    }: IMerossOnlineThingPropertyOptions,
  ) {

    const read = (
      abortable: Abortable,
    ): AsyncTask<boolean> => {
      // TODO
      return AsyncTask.success(true, abortable);
    };

    super({
      read,
      minObserveRefreshTime: 1000 * 10,
    });
  }
}
