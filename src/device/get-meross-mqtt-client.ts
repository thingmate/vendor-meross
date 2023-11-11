import { Abortable, AsyncTask } from '@lirx/async-task';
import { IInitMerossMqttClientOptions, IInitMerossMqttClientResult, initMerossMqttClient } from './init-meross-mqtt-client';

function forgeMerossMqttClientKey(
  {
    hostname = 'eu-iot.meross.com',
    port = 2001,
    userId,
    key,
  }: Omit<IInitMerossMqttClientOptions, 'abortable'>,
): string {
  return JSON.stringify({
    hostname,
    port,
    userId,
    key,
  });
}

type IAsyncReadonlyMerossMqttClientResult = AsyncTask<Readonly<IInitMerossMqttClientResult>>;

const map = new Map<string, IAsyncReadonlyMerossMqttClientResult>();

export function getMerossMqttClient(
  {
    abortable,
    ...options
  }: IInitMerossMqttClientOptions,
): IAsyncReadonlyMerossMqttClientResult {
  const key: string = forgeMerossMqttClientKey(options);

  let result: IAsyncReadonlyMerossMqttClientResult | undefined = map.get(key);

  if (result === void 0) {
    result = initMerossMqttClient({
      ...options,
      abortable: Abortable.never,
    });
    map.set(key, result);
  }

  return AsyncTask.switchAbortable(result, abortable);
}
