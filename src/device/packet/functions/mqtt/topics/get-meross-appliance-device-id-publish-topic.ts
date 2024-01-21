import { IDeviceId } from '../../../../../types/device-id.type';

export interface IGetMerossApplianceDeviceIdPublishTopicOptions {
  readonly deviceId: IDeviceId;
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

/* EXTRACT */

const REGEXP = new RegExp('^/appliance/(\\w+)/publish$');

export function extractDeviceIdFromMerossApplianceDeviceIdPublishTopic(
  input: string,
): IDeviceId | null {
  REGEXP.lastIndex = 0;
  const match: RegExpMatchArray | null = REGEXP.exec(input);

  return (match === null)
    ? null
    : match[1];
}
