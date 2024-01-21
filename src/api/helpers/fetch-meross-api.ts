import { md5 } from '@lifaon/md5';
import { asyncFetchJSON, AsyncTask, IAbortableOptions, IAsyncTaskConstraint } from '@lirx/async-task';
import { IUrlRewriter, NO_URL_REWRITE } from '@thingmate/wot-scripting-api';
import { MEROSS_SECRET } from '../constants/meross-secret.constant';

export interface IFetchMerossAPIOptions extends IAbortableOptions {
  readonly url: URL | string; // the url of the API to call
  readonly urlRewriter?: IUrlRewriter;
  readonly data: object; // the data for the API
  readonly token?: string; // an optional token (required for some services)
}

export interface IFetchMerossAPIResponseJSON<GData> {
  readonly apiStatus: number;
  readonly sysStatus: number;
  readonly info: string;
  readonly timestamp: number;
  readonly data: GData;
}

/**
 * Performs a http request on the Meross cloud servers.
 *
 * This is used to communicate with the Meross api.
 *
 * Sources:
 *  - https://github.com/Apollon77/meross-cloud/blob/master/index.js
 *  - https://github-wiki-see.page/m/albertogeniola/MerossIot/wiki/HTTP-APIs
 */
export function fetchMerossAPI<GData extends IAsyncTaskConstraint<GData>>(
  {
    url,
    urlRewriter = NO_URL_REWRITE,
    data,
    token,
    abortable,
  }: IFetchMerossAPIOptions,
): AsyncTask<GData> {
  // INFO: Meross requests are signed
  const nonce: string = generateRandomString(16);
  const timestamp: number = Date.now();
  const params: string = encodeParams(data);

  const dataToSign: string = MEROSS_SECRET + timestamp + nonce + params;
  const sign: string = md5(dataToSign);

  const headers: Headers = new Headers({
    'Authorization': `Basic ${token ?? ''}`,
    'Vendor': 'meross',
    'AppVersion': '3.22.4',
    'AppType': 'iOS',
    'AppLanguage': 'en',
    'User-Agent': 'intellect_socket/3.22.4 (iPhone; iOS 17.2; Scale/2.00)',
    // 'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Type': 'application/json',
  });

  // const withWithPayload: URL = new URL(url);
  // withWithPayload.searchParams.set('params', params);
  // withWithPayload.searchParams.set('sign', sign);
  // withWithPayload.searchParams.set('timestamp', String(timestamp));
  // withWithPayload.searchParams.set('nonce', nonce);

  const payload = {
    params,
    sign,
    timestamp,
    nonce,
  };

  const request: Request = new Request(urlRewriter(url.toString()), {
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
