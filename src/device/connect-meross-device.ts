import { Abortable, AsyncTask } from '@lirx/async-task';
import { getMerossMqttClient } from './get-meross-mqtt-client';
import { IInitMerossMqttClientOptions, IInitMerossMqttClientResult } from './init-meross-mqtt-client';
import {
  IDeviceOptionsForCreateAndSendMerossPacketAbility,
} from './packet/abilities/shared/device-options-for-create-and-send-meross-packet-ability';
import {
  prepareDeviceOptionsForCreateAndSendMerossPacketAbility,
} from './packet/prepare-device-options-for-create-and-send-meross-packet-ability';

export interface IConnectMerossDeviceOptions extends //
  IInitMerossMqttClientOptions,
  Omit<IDeviceOptionsForCreateAndSendMerossPacketAbility, keyof IInitMerossMqttClientResult | keyof IInitMerossMqttClientOptions>
//
{

}

export function connectMerossDevice(
  {
    deviceId,
    forgeHttpMerossPacketUrlFunction,
    timeout,
    ...options
  }: IConnectMerossDeviceOptions,
): AsyncTask<IDeviceOptionsForCreateAndSendMerossPacketAbility> {
  return getMerossMqttClient(options)
    .successful((clientResult: IInitMerossMqttClientResult, abortable: Abortable): AsyncTask<IDeviceOptionsForCreateAndSendMerossPacketAbility> => {
      return prepareDeviceOptionsForCreateAndSendMerossPacketAbility(
        {
          ...clientResult,
          deviceId,
          forgeHttpMerossPacketUrlFunction,
          timeout,
        },
        abortable,
      );
    });
}
