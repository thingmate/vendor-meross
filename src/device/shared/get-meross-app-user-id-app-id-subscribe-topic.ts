import { IHavingAppId } from '../../types/app-id.type';
import { IHavingUserId } from '../../types/user-id.type';

export interface IGetMerossAppUserIdAppIdSubscribeTopicOptions extends IHavingUserId, IHavingAppId {
}

/**
 * Used by the application to receive the response of a command from a device:
 * the device publishes the response to a command, and the app is listening to this topic
 */
export function getMerossAppUserIdAppIdSubscribeTopic(
  {
    userId,
    appId,
  }: IGetMerossAppUserIdAppIdSubscribeTopicOptions,
): string {
  return `/app/${userId}-${appId}/subscribe`;
}


