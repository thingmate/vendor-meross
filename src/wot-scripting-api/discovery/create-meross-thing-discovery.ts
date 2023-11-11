import { Abortable, AsyncTask } from '@lirx/async-task';
import { IPushSinkWithBackPressure } from '@lirx/stream';
import { IThingDiscovery } from '@thingmate/wot-scripting-api';
import {
  getMerossDeviceList,
  IMerossDeviceListResponseDataDeviceJSON,
  IMerossDeviceListResponseDataJSON,
  MEROSS_DEVICE_ONLINE_STATUS,
} from '../../api/get-meross-device-list';
import { IMerossLoginResponseDataJSON, IPerformMerossLoginOptions, performMerossLoginCached } from '../../api/perform-meross-login';
import { connectMerossDevice, IConnectMerossDeviceOptions } from '../../device/connect-meross-device';
import {
  IDeviceOptionsForCreateAndSendMerossPacketAbility,
} from '../../device/packet/abilities/shared/device-options-for-create-and-send-meross-packet-ability';
import { createMerossMss310SmartPlugThing } from '../thing/smart-plug/mss310/create-meross-mss310-smart-plug-thing';
import { IMerossGenericThing } from '../thing/types/meross-generic-thing.type';
import { IMerossThingDescription } from '../thing/types/meross-thing-description.type';

export interface ICreateMerossThingDiscoveryOptions extends Omit<IPerformMerossLoginOptions, 'abortable'>, Omit<IConnectMerossDeviceOptions, 'hostname' | 'deviceId' | 'userId' | 'key' | 'abortable' | 'port'> {
}

export type IMerossThingDiscovery = IThingDiscovery<IMerossGenericThing>;

export function createMerossThingDiscovery(
  options: ICreateMerossThingDiscoveryOptions,
): IMerossThingDiscovery {

  const convertMerossDeviceDetailsJSONToMerossThingDescription = (
    device: IMerossDeviceListResponseDataDeviceJSON,
  ): IMerossThingDescription => {
    return {
      id: device.uuid,
      title: device.devName,
      firmwareVersion: device.fmwareVersion,
      hardwareVersion: device.hdwareVersion,
      deviceType: device.deviceType,
      online: (device.onlineStatus === MEROSS_DEVICE_ONLINE_STATUS.ONLINE),
    };
  };

  const discover = (
    sink: IPushSinkWithBackPressure<IMerossGenericThing>,
    abortable: Abortable,
  ): AsyncTask<void> => {
    return performMerossLoginCached({
      ...options,
      abortable,
    })
      .successful((loginData: IMerossLoginResponseDataJSON, abortable: Abortable) => {
        const _connectMerossDevice = (
          device: IMerossDeviceListResponseDataDeviceJSON,
          abortable: Abortable,
        ): AsyncTask<IDeviceOptionsForCreateAndSendMerossPacketAbility> => {
          return connectMerossDevice({
            hostname: device.domain,
            deviceId: device.uuid,
            userId: loginData.userid,
            key: loginData.key,
            openWebSocketMqttClient: options.openWebSocketMqttClient,
            retry: 2,
            abortable,
          });
        };

        return getMerossDeviceList({
          token: loginData.token,
          fetch: options.fetch,
          abortable,
        })
          .successful((devices: IMerossDeviceListResponseDataJSON, abortable: Abortable): AsyncTask<void> => {

            const loop = (
              i: number,
              abortable: Abortable,
            ): AsyncTask<void> => {
              if (i < devices.length) {
                const device: IMerossDeviceListResponseDataDeviceJSON = devices[i];
                if (device.onlineStatus === MEROSS_DEVICE_ONLINE_STATUS.ONLINE) {
                  return _connectMerossDevice(device, abortable)
                    .successful((deviceOptions: IDeviceOptionsForCreateAndSendMerossPacketAbility): IMerossGenericThing => {
                      switch (device.deviceType) {
                        case 'mss310':
                          return createMerossMss310SmartPlugThing({
                            description: convertMerossDeviceDetailsJSONToMerossThingDescription(device),
                            deviceOptions,
                          });
                        default:
                          throw new Error(`Unsupported type: ${device.deviceType}`);

                      }
                    })
                    .successful(sink)
                    .then(
                      (_, abortable: Abortable): AsyncTask<void> => {
                        return loop(i + 1, abortable);
                      },
                      // INFO in case of error, we continue with others
                      (_, abortable: Abortable): AsyncTask<void> => {
                        return loop(i + 1, abortable);
                      },
                    );
                } else {
                  return loop(i + 1, abortable);
                }
              } else {
                return AsyncTask.void(abortable);
              }
            };

            return loop(0, abortable);
          });
      });
  };

  return {
    discover,
  };
}

