import { Abortable, AsyncTask } from '@lirx/async-task';
import { IMerossApiCacheOptions, merossApiCache } from './meross-api-cache';
import { IMerossLoginResponseDataJSON, IPerformMerossLoginOptions, performMerossLogin } from '../perform-meross-login';

/**
 * @experimental
 * @deprecated
 */
export interface IPerformMerossLoginCachedOptions extends //
  IPerformMerossLoginOptions,
  Omit<IMerossApiCacheOptions<IMerossLoginResponseDataJSON>, 'factory' | 'key'>
//
{
}

/**
 * @experimental
 * @deprecated
 */
export function performMerossLoginCached(
  {
    email,
    password,
    urlRewriter,
    store,
    abortable,
  }: IPerformMerossLoginCachedOptions,
): AsyncTask<IMerossLoginResponseDataJSON> {
  return merossApiCache<IMerossLoginResponseDataJSON>({
    factory: (abortable: Abortable): AsyncTask<IMerossLoginResponseDataJSON> => {
      return performMerossLogin({
        email,
        password,
        urlRewriter,
        abortable,
      });
    },
    key: [
      email,
      password,
    ],
    store,
    abortable,
  });
}
