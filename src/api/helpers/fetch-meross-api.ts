import { md5 } from '@lifaon/md5';
import { asyncFetchJSON, AsyncTask, IAbortableOptions, IAsyncTaskConstraint } from '@lirx/async-task';
import { MEROSS_SECRET } from '../constants/meross-secret.constant';

export interface IFetchMerossAPIOptions extends IAbortableOptions {
  url: URL | string;
  data: object;
  token?: string;
}

export interface IFetchMerossAPIResponseJSON<GData> {
  apiStatus: number;
  sysStatus: number;
  info: string;
  timestamp: number;
  data: GData;
}

export function fetchMerossAPI<GData extends IAsyncTaskConstraint<GData>>(
  {
    url,
    data,
    token,
    abortable,
  }: IFetchMerossAPIOptions,
): AsyncTask<GData> {
  const nonce = generateRandomString(16);
  const timestamp = Date.now();
  const params = encodeParams(data);

  const dataToSign = MEROSS_SECRET + timestamp + nonce + params;
  const sign = md5(dataToSign);

  const headers = new Headers({
    'Authorization': `Basic ${token ?? ''}`,
    'vender': 'meross',
    'AppVersion': '0.4.4.4',
    'AppType': 'MerossIOT',
    'AppLanguage': 'EN',
    'User-Agent': 'MerossIOT/0.4.4.4',
    'Content-Type': 'application/json',
  });

  const payload = {
    params,
    sign,
    timestamp,
    nonce,
  };

  const request = new Request(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });

  return asyncFetchJSON<IFetchMerossAPIResponseJSON<GData>>(
    request,
    void 0,
    abortable,
  )
    .successful((
      result: IFetchMerossAPIResponseJSON<GData>,
    ): GData => {
      if (result.apiStatus === 0) {
        return result.data;
      } else {
        throw new Error(`${result.apiStatus} ${result.info ? ` - ${result.info}` : ''}`);
      }
    });
}

/*---*/

function generateRandomString(
  length: number,
): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let nonce = '';
  while (nonce.length < length) {
    nonce += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return nonce;
}

function encodeParams(
  parameters: any,
): string {
  return btoa(JSON.stringify(parameters));
}
