import { IHavingDeviceId } from '../../types/having-device-id.type';

export interface IGetMerossApplianceDeviceIdSubscribeTopicOptions extends IHavingDeviceId {
}

/**
 * Used by the application to send a command to a device:
 * the app publishes a command, and the device is listening to this topic
 */
export function getMerossApplianceDeviceIdSubscribeTopic(
  {
    deviceId,
  }: IGetMerossApplianceDeviceIdSubscribeTopicOptions,
): string {
  return `/appliance/${deviceId}/subscribe`;
}
