import { Abortable, AsyncTask } from '@lirx/async-task';
import {
  IMerossApplianceSystemFirmwareAbilityGETACKPayload,
  IMerossApplianceSystemFirmwareAbilityGETPayload,
  MEROSS_APPLIANCE_SYSTEM_FIRMWARE_ABILITY_NAME,
} from './abilities/appliance-system-firmware/meross-appliance-system-firmware.type';
import {
  IDeviceOptionsForCreateAndSendMerossPacketAbility,
} from './abilities/shared/device-options-for-create-and-send-meross-packet-ability';
import { createAndSendHttpMerossPacketWithTimeout } from './http/create-and-send-http-meross-packet-with-timeout';
import { createAndSendMqttMerossPacket, ICreateAndSendMqttMerossPacketOptions } from './mqtt/create-and-send-mqtt-meross-packet';

export function prepareDeviceOptionsForCreateAndSendMerossPacketAbility(
  options: IDeviceOptionsForCreateAndSendMerossPacketAbility,
  abortable: Abortable,
): AsyncTask<IDeviceOptionsForCreateAndSendMerossPacketAbility> {
  const _options: Omit<ICreateAndSendMqttMerossPacketOptions<IMerossApplianceSystemFirmwareAbilityGETPayload>, 'abortable'> = {
    ...options,
    method: 'GET',
    namespace: MEROSS_APPLIANCE_SYSTEM_FIRMWARE_ABILITY_NAME,
    payload: {},
  };

  return createAndSendMqttMerossPacket<IMerossApplianceSystemFirmwareAbilityGETPayload, IMerossApplianceSystemFirmwareAbilityGETACKPayload>({
    ..._options,
    abortable,
  })
    .successful((
      data: IMerossApplianceSystemFirmwareAbilityGETACKPayload,
      abortable: Abortable,
    ): AsyncTask<IDeviceOptionsForCreateAndSendMerossPacketAbility> => {
      const hostname: string = data.firmware.innerIp;

      return createAndSendHttpMerossPacketWithTimeout<IMerossApplianceSystemFirmwareAbilityGETPayload, IMerossApplianceSystemFirmwareAbilityGETACKPayload>({
        ..._options,
        hostname,
        abortable,
      })
        .then(
          (): IDeviceOptionsForCreateAndSendMerossPacketAbility => {
            return {
              ...options,
              hostname,
            };
          },
          (): IDeviceOptionsForCreateAndSendMerossPacketAbility => {
            return options;
          },
        );
    });
}
