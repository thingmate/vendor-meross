import { IAsyncStore } from '@lirx/async-store';
import { Abortable, AsyncTask, IAbortableOptions } from '@lirx/async-task';
import { getMerossDeviceListCached, IGetMerossDeviceListCachedOptions } from '../../api/cache/get-meross-device-list-cached';
import { IPerformMerossLoginCachedOptions, performMerossLoginCached } from '../../api/cache/perform-meross-login-cached';
import { IMerossDeviceListResponseDataDeviceJSON, IMerossDeviceListResponseDataJSON } from '../../api/get-meross-device-list';
import { IMerossLoginResponseDataJSON } from '../../api/perform-meross-login';
import { createMerossThing, ICreateMerossThingOptions, IMerossThing } from '../thing/meross-thing';

export interface IListMerossThingsOptions extends //
  Omit<IPerformMerossLoginCachedOptions, 'urlRewriter' | 'abortable'>,
  Omit<IGetMerossDeviceListCachedOptions, 'urlRewriter' | 'token' | 'abortable'>,
  Omit<ICreateMerossThingOptions, 'key' | 'userId' | 'device' | 'abortable'>,
  IAbortableOptions
//
{
  readonly store: IAsyncStore<[string, any]>;
}

export function listMerossThings(
  {
    email,
    password,
    mqtt,
    http: {
      urlRewriter: httpUrlRewriter,
      ...http
    } = {},
    appId,
    store,
    abortable,
  }: IListMerossThingsOptions,
): AsyncTask<IMerossThing[]> {
  return performMerossLoginCached({
    email,
    password,
    urlRewriter: httpUrlRewriter,
    store,
    abortable,
  })
    .successful((loginData: IMerossLoginResponseDataJSON, abortable: Abortable): AsyncTask<IMerossThing[]> => {
      return getMerossDeviceListCached({
        token: loginData.token,
        urlRewriter: httpUrlRewriter,
        store,
        abortable,
      })
        .successful((devices: IMerossDeviceListResponseDataJSON): IMerossThing[] => {
          return devices.map((device: IMerossDeviceListResponseDataDeviceJSON): IMerossThing => {
            return createMerossThing({
              mqtt,
              http: {
                ...http,
                urlRewriter: httpUrlRewriter,
              },
              key: loginData.key,
              userId: loginData.userid,
              appId,
              device,
            });
          });
        });
    });
}
