import { md5 } from '@lifaon/md5';
import { Abortable, AsyncTask, IAbortableOptions } from '@lirx/async-task';
import { IMqttProtocolVersion, IWebSocketMqttClient, openWebSocketMqttClient } from '@thingmate/mqtt';
import { IHavingAppId } from '../types/having-app-id.type';
import { IHavingUserId } from '../types/having-user-id.type';
import { IHavingUserKey } from '../types/having-user-key.type';
import { getMerossAppUserIdAppIdSubscribeTopic } from './shared/get-meross-app-user-id-app-id-subscribe-topic';
import { getMerossAppUserIdSubscribeTopic } from './shared/get-meross-app-user-id-subscribe-topic';

export type IOpenWebSocketMqttClientFunction = typeof openWebSocketMqttClient;

export interface IInitMerossMqttClientOptions extends //
  IHavingUserKey,
  IHavingUserId,
  IAbortableOptions
//
{
  hostname?: string;
  port?: number;
  openWebSocketMqttClient?: IOpenWebSocketMqttClientFunction;
}

export interface IInitMerossMqttClientResult extends //
  IHavingAppId,
  IHavingUserId,
  IHavingUserKey
//
{
  client: IWebSocketMqttClient;
}

export function initMerossMqttClient(
  {
    hostname = 'eu-iot.meross.com',
    port = 2001,
    openWebSocketMqttClient: _openWebSocketMqttClient = openWebSocketMqttClient,
    userId,
    key,
    abortable,
  }: IInitMerossMqttClientOptions,
): AsyncTask<IInitMerossMqttClientResult> {
  const protocolVersion: IMqttProtocolVersion = 5;

  const keepalive: number = 30;
  const username = userId;
  const password = md5(userId + key);
  const appId = md5(crypto.randomUUID());
  const clientId = `app:${appId}`;

  return _openWebSocketMqttClient({
    url: new URL(`wss://${hostname}:${port}/mqtt`),
    abortable,
    protocolVersion,
  })
    .successful((
      client: IWebSocketMqttClient,
      abortable: Abortable,
    ): AsyncTask<IInitMerossMqttClientResult> => {
      return client.connect({
        protocolVersion,
        keepalive,
        clientId,
        username,
        password,
        abortable,
      })
        .successful((_, abortable: Abortable) => {
          return client.subscribe({
            topic: getMerossAppUserIdAppIdSubscribeTopic({
              userId,
              appId,
            }),
            abortable,
          });
        })
        .successful((_, abortable: Abortable) => {
          return client.subscribe({
            topic: getMerossAppUserIdSubscribeTopic({
              userId,
            }),
            abortable,
          });
        })
        .successful((): IInitMerossMqttClientResult => {
          return {
            client,
            appId,
            userId,
            key,
          };
        });
    });
}
