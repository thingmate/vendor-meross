import { IHavingUserId } from '../../types/user-id.type';

export interface IGetMerossAppUserIdSubscribeTopicOptions extends IHavingUserId {
}

/**
 * Used by the application to receive a PUSH notification from a device:
 * the device publishes a notification on another linked topic, and the app is listening to this topic
 */
export function getMerossAppUserIdSubscribeTopic(
  {
    userId,
  }: IGetMerossAppUserIdSubscribeTopicOptions,
): string {
  return `/app/${userId}/subscribe`;
}
