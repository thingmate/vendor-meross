import { AsyncTask, IAbortableOptions } from '@lirx/async-task';
import { IUrlRewriter, NO_URL_REWRITE } from '@thingmate/wot-scripting-api';
import { MEROSS_DEVICE_LIST_URL } from './constants/meross-device-list-url.constant';
import { fetchMerossAPI } from './helpers/fetch-meross-api';

/* TYPES */

/**
 * The `data` interface to send when getting the list of devices.
 */
export interface IMerossDeviceListRequestDataJSON {
}

export interface IMerossDeviceListResponseDataDeviceChanelJSON {

}

export const enum MEROSS_DEVICE_ONLINE_STATUS {
  ONLINE = 1,
  OFFLINE = 2,
}

/**
 * The interface returned by this API representing a device.
 */
export interface IMerossDeviceListResponseDataDeviceJSON {
  readonly uuid: string;
  readonly onlineStatus: MEROSS_DEVICE_ONLINE_STATUS;
  readonly devName: string;
  readonly devIconId: string;
  readonly bindTime: number;
  readonly deviceType: 'mss310' | string;
  readonly subType: string;
  readonly channels: readonly IMerossDeviceListResponseDataDeviceChanelJSON[];
  readonly region: string;
  readonly fmwareVersion: string;
  readonly hdwareVersion: string;
  readonly userDevIcon: string;
  readonly iconType: number;
  readonly cluster: number;
  readonly domain: string; // ex: mqtt-eu-2.meross.com
  readonly reservedDomain: string;
  readonly hardwareCapabilities: unknown[];
}

/**
 * The data returned by this API.
 */
export type IMerossDeviceListResponseDataJSON = IMerossDeviceListResponseDataDeviceJSON[];

/**
 * The options to get the list of devices.
 */
export interface IGetMerossDeviceListOptions extends IAbortableOptions {
  readonly token: string;
  readonly urlRewriter?: IUrlRewriter;
}

/* FUNCTION */

/**
 * Performs a http request to get the list of devices from the Meross cloud servers.
 */
export function getMerossDeviceList(
  {
    token,
    urlRewriter,
    abortable,
  }: IGetMerossDeviceListOptions,
): AsyncTask<IMerossDeviceListResponseDataJSON> {
  const data: IMerossDeviceListRequestDataJSON = {};

  return fetchMerossAPI<IMerossDeviceListResponseDataJSON>({
    url: MEROSS_DEVICE_LIST_URL,
    urlRewriter,
    data,
    token,
    abortable,
  });
}


