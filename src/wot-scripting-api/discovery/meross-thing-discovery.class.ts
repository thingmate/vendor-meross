import { Abortable, AsyncTask } from '@lirx/async-task';
import {
  createPushSourceWithBackPressureFromAsyncTaskIteratorFactory, filterPushPipeWithBackPressure,
  IPushSinkWithBackPressure,
  IPushSourceWithBackPressure,
} from '@lirx/stream';
import { IGenericThing, SMART_PLUG_TD, ThingDiscovery } from '@thingmate/wot-scripting-api';
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
import { MerossMss310SmartPlugThing } from '../things/smart-plug/mss310/meross-mss310-smart-plug-thing.class';

export interface IMerossThingDiscoveryOptions extends Omit<IPerformMerossLoginOptions, 'abortable'>, Omit<IConnectMerossDeviceOptions, 'hostname' | 'deviceId' | 'userId' | 'key' | 'abortable' | 'port'> {
}

export interface IMerossThingDiscoveryDiscoverOptions {
  showOffLine?: boolean;
}

export class MerossThingDiscovery extends ThingDiscovery<IMerossThingDiscoveryDiscoverOptions | void> {
  constructor(
    options: IMerossThingDiscoveryOptions,
  ) {
    super({
      discover: (
        {
          showOffLine = false,
        }: IMerossThingDiscoveryDiscoverOptions | void = {},
      ): IPushSourceWithBackPressure<IGenericThing> => {
        return (
          sink: IPushSinkWithBackPressure<IGenericThing>,
          abortable: Abortable,
        ): AsyncTask<void> => {
          return performMerossLoginCached({
            ...options,
            abortable,
          })
            .successful((loginData: IMerossLoginResponseDataJSON, abortable: Abortable) => {
              return getMerossDeviceList({
                token: loginData.token,
                fetch: options.fetch,
                abortable,
              })
                .successful((devices: IMerossDeviceListResponseDataJSON, abortable: Abortable): AsyncTask<void> => {
                  const rawStream = createPushSourceWithBackPressureFromAsyncTaskIteratorFactory<IGenericThing | null>(
                    (function* (abortable: Abortable): Generator<AsyncTask<IGenericThing | null>, void, Abortable> {
                      for (let i = 0, l = devices.length; i < l; i++) {
                        const device: IMerossDeviceListResponseDataDeviceJSON = devices[i];

                        if (
                          (device.onlineStatus === MEROSS_DEVICE_ONLINE_STATUS.ONLINE)
                          || showOffLine
                        ) {
                          abortable = yield connectMerossDevice({
                            hostname: device.domain,
                            deviceId: device.uuid,
                            userId: loginData.userid,
                            key: loginData.key,
                            openWebSocketMqttClient: options.openWebSocketMqttClient,
                            retry: 2,
                            abortable,
                          })
                            .successful((deviceOptions: IDeviceOptionsForCreateAndSendMerossPacketAbility) => {
                              switch (device.deviceType) {
                                case 'mss310':
                                  return new MerossMss310SmartPlugThing({
                                    description: {
                                      id: device.uuid,
                                      title: device.devName,
                                      firmwareVersion: device.fmwareVersion,
                                      hardwareVersion: device.hdwareVersion,
                                      deviceType: device.deviceType,
                                      isOnline: (device.onlineStatus === MEROSS_DEVICE_ONLINE_STATUS.ONLINE),
                                      ...SMART_PLUG_TD,
                                    },
                                    deviceOptions,
                                  });
                                default:
                                  console.error(new Error(`Unsupported type: ${device.deviceType}`));
                                  return null;

                              }
                            })
                            .errored(() => {
                              return null;
                            });
                        }
                      }
                    }),
                  );

                  const stream = filterPushPipeWithBackPressure<IGenericThing | null, IGenericThing>(rawStream, (thing: IGenericThing | null) => {
                    return thing !== null;
                  });

                  return stream(sink, abortable);
                });
            });
        };
      },
    });
  }
}
