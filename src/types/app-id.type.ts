import { md5 } from '@lifaon/md5';

export type IAppId = string;

/**
 * @deprecated
 */
export interface IHavingAppId {
  readonly appId: IAppId;
}

export function generateRandomMerossAppId(): IAppId {
  return md5(crypto.randomUUID());
}
