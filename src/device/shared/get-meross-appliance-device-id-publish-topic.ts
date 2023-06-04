import { IHavingDeviceId } from '../../types/having-device-id.type';

export interface IGetMerossApplianceDeviceIdPublishTopicOptions extends IHavingDeviceId {
}

/**
 * Used by the device to send a notification:
 * the device publishes a notification to this topic, and the app is listening to another one linked
 */
export function getMerossApplianceDeviceIdPublishTopic(
  {
    deviceId,
  }: IGetMerossApplianceDeviceIdPublishTopicOptions,
): string {
  return `/appliance/${deviceId}/publish`;
}
