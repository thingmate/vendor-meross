import { Abortable, AsyncTask } from '@lirx/async-task';
import { MEROSS_LOGIN_URL } from './constants/meross-login-url.constant';
import { IHavingUserKey } from '../types/user-key.type';
import { fetchMerossAPI } from './fetch-meross-api';

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

export interface IPerformMerossLoginOptions {
  email: string;
  password: string;
  abortable: Abortable;
}

export function performMerossLogin(
  {
    email,
    password,
    abortable,
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
    url: MEROSS_LOGIN_URL,
    data,
    abortable,
  });
}
