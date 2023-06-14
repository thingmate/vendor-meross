import { Abortable, AsyncTask } from '@lirx/async-task';
import { getMerossMqttClient } from './get-meross-mqtt-client';
import { IInitMerossMqttClientOptions, IInitMerossMqttClientResult } from './init-meross-mqtt-client';
import {
  IDeviceOptionsForCreateAndSendMerossPacketAbility,
} from './packet/abilities/shared/device-options-for-create-and-send-meross-packet-ability';
import {
  IPrepareDeviceOptionsForCreateAndSendMerossPacketAbilityOptions,
  prepareDeviceOptionsForCreateAndSendMerossPacketAbility,
} from './packet/prepare-device-options-for-create-and-send-meross-packet-ability';

export interface IConnectMerossDeviceOptions extends //
  IInitMerossMqttClientOptions,
  Omit<IPrepareDeviceOptionsForCreateAndSendMerossPacketAbilityOptions, keyof IInitMerossMqttClientResult | keyof IInitMerossMqttClientOptions>
//
{

}

export function connectMerossDevice(
  {
    deviceId,
    timeout,
    retry,
    ...options
  }: IConnectMerossDeviceOptions,
): AsyncTask<IDeviceOptionsForCreateAndSendMerossPacketAbility> {
  return getMerossMqttClient(options)
    .successful((clientResult: IInitMerossMqttClientResult, abortable: Abortable): AsyncTask<IDeviceOptionsForCreateAndSendMerossPacketAbility> => {
      return prepareDeviceOptionsForCreateAndSendMerossPacketAbility({
        ...clientResult,
        deviceId,
        timeout,
        retry,
        abortable,
      });
    });
}
