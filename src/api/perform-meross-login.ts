import { md5 } from '@lifaon/md5';
import { AsyncTask, IAbortableOptions } from '@lirx/async-task';
import { IUrlRewriter } from '@thingmate/wot-scripting-api';
import { MEROSS_LOGIN_URL } from './constants/meross-login-url.constant';
import { fetchMerossAPI } from './helpers/fetch-meross-api';

/* TYPES */

export interface IMerossLoginRequestDataMobileInfoJSON {
  readonly resolution: string;
  readonly carrier: string;
  readonly deviceModel: string;
  readonly mobileOs: string;
  readonly mobileOSVersion: string;
  readonly uuid: string;
}

/**
 * The `data` interface to send when login.
 */
export interface IMerossLoginRequestDataJSON {
  readonly email: string;
  readonly password: string;
  readonly encryption: number;
  readonly accountCountryCode: string;
  readonly mobileInfo: IMerossLoginRequestDataMobileInfoJSON;
  readonly agree: number;
  readonly mfaCode: unknown | undefined,
}

/**
 * The response sent by the Meross cloud servers when login.
 *
 * These properties are used later, when connection to the MQTT server, and when sending packets.
 */
export interface IMerossLoginResponseDataJSON {
  readonly userid: string;
  readonly email: string;
  readonly token: string;
  readonly key: string;
  readonly domain: string; // ex: https://iotx-eu.meross.com
  readonly mqttDomain: string; // ex: mqtt-eu-2.meross.com
  readonly mfaLockExpire: number;
}

/**
 * The options to login.
 */
export interface IPerformMerossLoginOptions extends IAbortableOptions {
  readonly email: string;
  readonly password: string;
  readonly urlRewriter?: IUrlRewriter;
}

/* FUNCTION */

/**
 * Performs a http request to login on the Meross cloud servers.
 *
 * WARN: Meross highly limits the API calls, so this function's result should be cached.
 */
export function performMerossLogin(
  {
    email,
    password,
    urlRewriter,
    abortable,
  }: IPerformMerossLoginOptions,
): AsyncTask<IMerossLoginResponseDataJSON> {
  const logIdentifier = '0b11b194f83724b614a6975b112f63cee2f098-8125-40c7-a280-5115913d9887';

  const hashedPassword: string = md5(password);

  const data: IMerossLoginRequestDataJSON = {
    email,
    password: hashedPassword,
    encryption: 1,
    accountCountryCode: '--',
    mobileInfo: {
      resolution: '--',
      carrier: '--',
      deviceModel: '--',
      mobileOs: 'linux',
      mobileOSVersion: '--',
      uuid: logIdentifier,
    },
    agree: 1,
    mfaCode: void 0,
  };

  return fetchMerossAPI<IMerossLoginResponseDataJSON>({
    url: MEROSS_LOGIN_URL,
    urlRewriter,
    data,
    abortable,
  });
}
