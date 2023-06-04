import { AsyncTask } from '@lirx/async-task';
import { MEROSS_DEVICE_LIST_URL } from './constants/meross-device-list-url.constant';
import { fetchMerossAPI, IFetchMerossAPIOptions } from './helpers/fetch-meross-api';

export interface IMerossDeviceListRequestDataJSON {
}

export interface IMerossDeviceListResponseDataDeviceChanelJSON {

}

export const enum MEROSS_DEVICE_ONLINE_STATUS {
  ONLINE = 1,
  OFFLINE = 2,
}

export interface IMerossDeviceListResponseDataDeviceJSON {
  uuid: string;
  onlineStatus: MEROSS_DEVICE_ONLINE_STATUS;
  devName: string;
  devIconId: string;
  bindTime: number;
  deviceType: string;
  subType: string;
  channels: IMerossDeviceListResponseDataDeviceChanelJSON[];
  region: string;
  fmwareVersion: string;
  hdwareVersion: string;
  userDevIcon: string;
  iconType: number;
  cluster: number;
  domain: string;
  reservedDomain: string;
}

export type IMerossDeviceListResponseDataJSON = IMerossDeviceListResponseDataDeviceJSON[];

export interface IGetMerossDeviceListOptions extends Omit<IFetchMerossAPIOptions, 'data' | 'url' | 'token'>, Required<Pick<IFetchMerossAPIOptions, 'token'>> {
}

export function getMerossDeviceList(
  {
    token,
    ...options
  }: IGetMerossDeviceListOptions,
): AsyncTask<IMerossDeviceListResponseDataJSON> {
  const data: IMerossDeviceListRequestDataJSON = {};

  return fetchMerossAPI<IMerossDeviceListResponseDataJSON>({
    ...options,
    url: MEROSS_DEVICE_LIST_URL,
    data,
    token,
  });
}
