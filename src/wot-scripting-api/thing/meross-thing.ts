import { IMerossDeviceListResponseDataDeviceJSON } from '../../api/get-meross-device-list';
import {
  AutoMerossDeviceManager, IAutoMerossDeviceManagerHttpOptions,
  IAutoMerossDeviceManagerMqttOptions,
  IAutoMerossDeviceManagerOptions,
} from '../../device/manager/implementations/auto/auto-meross-device-manager.class';
import { createMerossMss310SmartPlugThing, IMerossMss310SmartPlugThing } from './smart-plug/mss310/meross-mss310-smart-plug-thing';

export type IMerossThing =
  | IMerossMss310SmartPlugThing
  ;

export interface ICreateMerossThingOptions extends Omit<IAutoMerossDeviceManagerOptions, 'deviceId' | 'mqtt' | 'http'> {
  readonly device: IMerossDeviceListResponseDataDeviceJSON;
  readonly mqtt?: Omit<IAutoMerossDeviceManagerMqttOptions, 'hostname'> & Partial<Pick<IAutoMerossDeviceManagerMqttOptions, 'hostname'>>;
  readonly http?: IAutoMerossDeviceManagerHttpOptions;
}

export function createMerossThing(
  {
    mqtt,
    http,
    key,
    userId,
    appId,
    device,
  }: ICreateMerossThingOptions,
): IMerossThing {
  const manager: AutoMerossDeviceManager = new AutoMerossDeviceManager({
    mqtt: {
      hostname: device.domain,
      ...mqtt,
    },
    http,
    key,
    userId,
    appId,
    deviceId: device.uuid,
  });

  switch (device.deviceType) {
    case 'mss310':
      return createMerossMss310SmartPlugThing({
        manager,
        device,
        channel: 0,
      });
    default:
      throw new Error(`Unsupported type: ${device.deviceType}`);
  }
}
