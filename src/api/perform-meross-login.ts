import { md5 } from '@lifaon/md5';
import { Abortable, AsyncTask } from '@lirx/async-task';
import { retrieveOrGenerateEncryptedData } from '../crypto/store-encrypted-data';
import { IHavingUserKey } from '../types/having-user-key.type';
import { MEROSS_LOGIN_URL } from './constants/meross-login-url.constant';
import { fetchMerossAPI, IFetchMerossAPIOptions } from './helpers/fetch-meross-api';

export interface IMerossLoginRequestDataMobileInfoJSON {
  deviceModel: string;
  mobileOsVersion: string;
  mobileOs: string;
  uuid: string;
  carrier: string;
}

export interface IMerossLoginRequestDataJSON {
  email: string;
  password: string;
  mobileInfo: IMerossLoginRequestDataMobileInfoJSON;
}

export interface IMerossLoginResponseDataJSON extends IHavingUserKey {
  userid: string;
  email: string;
  token: string;
}

export interface IPerformMerossLoginOptions extends Omit<IFetchMerossAPIOptions, 'data' | 'url'> {
  email: string;
  password: string;
}

export function performMerossLogin(
  {
    email,
    password,
    ...options
  }: IPerformMerossLoginOptions,
): AsyncTask<IMerossLoginResponseDataJSON> {
  const logIdentifier = '0b11b194f83724b614a6975b112f63cee2f098-8125-40c7-a280-5115913d9887';

  const data: IMerossLoginRequestDataJSON = {
    email,
    password,
    mobileInfo: {
      deviceModel: '',
      mobileOsVersion: '',
      mobileOs: 'linux',
      uuid: logIdentifier,
      carrier: '',
    },
  };

  return fetchMerossAPI<IMerossLoginResponseDataJSON>({
    ...options,
    url: MEROSS_LOGIN_URL,
    data,
  });
}

/*-------------*/

export function getPerformMerossLoginCachedKey(
  {
    email,
    password,
  }: Pick<IPerformMerossLoginOptions, 'email' | 'password'>,
): string {
  // TODO maybe use crypto.subtle.digest
  return 'meross-login-' + md5(
    JSON.stringify({
      email,
      password,
    }),
  );
}

const PERFORM_MEROSS_LOGIN_CACHE = new Map<string, AsyncTask<IMerossLoginResponseDataJSON>>;

export interface IPerformMerossLoginCachedOptions extends IPerformMerossLoginOptions {
  fresh?: boolean;
}

export function performMerossLoginCached(
  {
    fresh = false,
    ...options
  }: IPerformMerossLoginCachedOptions,
): AsyncTask<IMerossLoginResponseDataJSON> {
  const key: string = getPerformMerossLoginCachedKey(options);

  let task: AsyncTask<IMerossLoginResponseDataJSON> | undefined = PERFORM_MEROSS_LOGIN_CACHE.get(key);

  if ((task === void 0) || fresh) {
    task = retrieveOrGenerateEncryptedData({
      ...options,
      key,
      dataFactory: (abortable: Abortable): AsyncTask<IMerossLoginResponseDataJSON> => {
        return performMerossLogin({
          ...options,
          abortable,
        });
      },
      abortable: Abortable.never,
    })
      .errored((error: unknown): never => {
        PERFORM_MEROSS_LOGIN_CACHE.delete(key);
        throw error;
      });

    PERFORM_MEROSS_LOGIN_CACHE.set(key, task);
  }

  return AsyncTask.switchAbortable(task, options.abortable);
}

