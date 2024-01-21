import { IMerossDeviceListResponseDataDeviceJSON } from '../../../../api/get-meross-device-list';
import { IMerossThingDescription } from '../types/meross-thing-description.type';

export function convertMerossDeviceDetailsJSONToMerossThingDescription(
  device: IMerossDeviceListResponseDataDeviceJSON,
): IMerossThingDescription {
  return {
    id: device.uuid,
    title: device.devName,
    firmwareVersion: device.fmwareVersion,
    hardwareVersion: device.hdwareVersion,
    deviceType: device.deviceType,
  };
}
