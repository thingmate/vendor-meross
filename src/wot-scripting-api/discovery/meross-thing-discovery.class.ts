import { Abortable, AsyncTask } from '@lirx/async-task';
import {
  createPushSourceWithBackPressureFromAsyncTaskIteratorFactory,
  IPushSinkWithBackPressure,
  IPushSourceWithBackPressure,
} from '@lirx/stream';
import { IGenericThing, ThingDiscovery } from '@thingmate/wot-scripting-api';
import {
  getMerossDeviceList,
  IMerossDeviceListResponseDataDeviceJSON,
  IMerossDeviceListResponseDataJSON,
} from '../../api/get-meross-device-list';
import { IMerossLoginResponseDataJSON, IPerformMerossLoginOptions, performMerossLogin } from '../../api/perform-meross-login';
import { connectMerossDevice } from '../../device/connect-meross-device';
import {
  IDeviceOptionsForCreateAndSendMerossPacketAbility,
} from '../../device/packet/abilities/shared/device-options-for-create-and-send-meross-packet-ability';
import { MerossMss310SmartPlugThing } from '../things/smart-plug/mss310/meross-mss310-smart-plug-thing.class';

export interface IMerossThingDiscoveryOptions extends Omit<IPerformMerossLoginOptions, 'abortable'> {
}

export class MerossThingDiscovery extends ThingDiscovery {
  constructor(
    options: IMerossThingDiscoveryOptions,
  ) {
    super({
      discover: (): IPushSourceWithBackPressure<IGenericThing> => {
        return (
          sink: IPushSinkWithBackPressure<IGenericThing>,
          abortable: Abortable,
        ): AsyncTask<void> => {
          return performMerossLogin({
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
                  const stream = createPushSourceWithBackPressureFromAsyncTaskIteratorFactory<IGenericThing>(
                    (function* (abortable: Abortable): Generator<AsyncTask<IGenericThing>, void, Abortable> {
                      for (let i = 0, l = devices.length; i < l; i++) {
                        const device: IMerossDeviceListResponseDataDeviceJSON = devices[i];

                        switch (device.deviceType) {
                          case 'mss310':
                            abortable = yield connectMerossDevice({
                              hostname: device.domain,
                              deviceId: device.uuid,
                              userId: loginData.userid,
                              key: loginData.key,
                              abortable,
                            })
                              .successful((deviceOptions: IDeviceOptionsForCreateAndSendMerossPacketAbility) => {
                                return new MerossMss310SmartPlugThing({
                                  deviceOptions,
                                });
                              });
                            break;

                        }
                      }
                    }),
                  );

                  return stream(sink, abortable);
                });
            });

        };
      },
    });
  }
}
