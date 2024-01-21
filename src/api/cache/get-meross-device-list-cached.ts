import { Abortable, AsyncTask } from '@lirx/async-task';
import { getMerossDeviceList, IGetMerossDeviceListOptions, IMerossDeviceListResponseDataJSON } from '../get-meross-device-list';
import { IMerossApiCacheOptions, merossApiCache } from './meross-api-cache';

/**
 * @experimental
 * @deprecated
 */
export interface IGetMerossDeviceListCachedOptions extends //
  IGetMerossDeviceListOptions,
  Omit<IMerossApiCacheOptions<IMerossDeviceListResponseDataJSON>, 'factory' | 'key'>
//
{
}

/**
 * @experimental
 * @deprecated
 */
export function getMerossDeviceListCached(
  {
    token,
    urlRewriter,
    store,
    abortable,
  }: IGetMerossDeviceListCachedOptions,
): AsyncTask<IMerossDeviceListResponseDataJSON> {
  return merossApiCache<IMerossDeviceListResponseDataJSON>({
    factory: (abortable: Abortable): AsyncTask<IMerossDeviceListResponseDataJSON> => {
      return getMerossDeviceList({
        token,
        urlRewriter,
        abortable,
      });
    },
    key: [
      token,
    ],
    store,
    abortable,
  });
}
