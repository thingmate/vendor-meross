import { IDeviceId } from '../../../../../types/device-id.type';

export interface IGetMerossApplianceDeviceIdSubscribeTopicOptions {
  readonly deviceId: IDeviceId;
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

/* EXTRACT */

const REGEXP = new RegExp('^/appliance/(\\w+)/subscribe$');

export function extractDeviceIdFromMerossApplianceDeviceIdSubscribeTopic(
  input: string,
): IDeviceId | null {
  REGEXP.lastIndex = 0;
  const match: RegExpMatchArray | null = REGEXP.exec(input);

  return (match === null)
    ? null
    : match[1];
}
