import {
  Abortable,
  AbortableController,
  AsyncTask, asyncTaskWithTimeout,
  IAbortableOptions,
  IAsyncTaskConstraint,
  IAsyncTaskErrorFunction,
  IAsyncTaskSuccessFunction,
} from '@lirx/async-task';
import { IPushSourceWithBackPressure } from '@lirx/stream';
import { IMinimalMqttClientObserveTrait, IMinimalMqttClientPublishTrait, IReadonlyMqttPacketPayload } from '@thingmate/mqtt';
import { IAppId } from '../../../../../types/app-id.type';
import { IDeviceId } from '../../../../../types/device-id.type';
import { IUserId } from '../../../../../types/user-id.type';
import { IUserKey } from '../../../../../types/user-key.type';
import { IGenericMerossPacket } from '../../../meross-packet.type';
import { verifyMerossPacket } from '../../verify-meross-packet';
import { getMerossAppUserIdAppIdSubscribeTopic } from '../topics/get-meross-app-user-id-app-id-subscribe-topic';
import { getMerossApplianceDeviceIdSubscribeTopic } from '../topics/get-meross-appliance-device-id-subscribe-topic';

export interface ISendMqttMerossPacketUsingMinimalMqttClientOptions extends IAbortableOptions {
  readonly client: IMinimalMqttClientPublishTrait & IMinimalMqttClientObserveTrait;
  readonly key: IUserKey;
  readonly userId: IUserId;
  readonly appId: IAppId;
  readonly deviceId: IDeviceId;
  readonly packet: IGenericMerossPacket;
  readonly unsubscribeDelay?: number;
}

/**
 * Sends a Meross Packet over mqtt and awaits for a response.
 *
 * Returns the payload of the response.
 */
export function sendMqttMerossPacketUsingMinimalMqttClient<GResponsePayload extends IAsyncTaskConstraint<GResponsePayload>>(
  {
    client,
    key,
    userId,
    appId,
    deviceId,
    packet,
    unsubscribeDelay = 5000,
    abortable,
  }: ISendMqttMerossPacketUsingMinimalMqttClientOptions,
): AsyncTask<GResponsePayload> {
  return new AsyncTask<GResponsePayload>((
    _success: IAsyncTaskSuccessFunction<GResponsePayload>,
    _error: IAsyncTaskErrorFunction,
    abortable: Abortable,
  ): void => {
    const controller: AbortableController = new AbortableController();
    const localAbortable: Abortable = controller.abortable;

    let running: boolean = true;
    const end = (callback: () => void): void => {
      if (running) {
        running = false;
        unsubscribeOfAbort();

        if (unsubscribeDelay <= 0) {
          abort();
        } else {
          setTimeout((): void => {
            abort();
          }, unsubscribeDelay);
        }

        callback();
      }
    };

    const unsubscribeOfAbort = abortable.onAbort((): void => {
      end(() => {});
    });

    const abort = (reason: any = 'Aborted'): void => {
      controller.abort(reason);
    };

    const success = (value: GResponsePayload): void => {
      end(() => _success(value));
    };

    const error = (error: unknown): void => {
      end(() => _error(error));
    };

    const clientResponse$: IPushSourceWithBackPressure<IReadonlyMqttPacketPayload> = client.observe(
      getMerossAppUserIdAppIdSubscribeTopic({
        userId,
        appId,
      }),
    );

    clientResponse$((
      payload: IReadonlyMqttPacketPayload,
    ): void => {
      const merossResponsePacket: IGenericMerossPacket = JSON.parse(payload.toString());

      if (merossResponsePacket.header.messageId === packet.header.messageId) {
        try {
          verifyMerossPacket({
            packet: merossResponsePacket,
            key,
          });
          // TODO ensure than packet is an ACK
          success(merossResponsePacket.payload);
        } catch (_error: unknown) {
          error(_error);
        }
      }
    }, localAbortable)
      .errored(error);

    client.publish(
      getMerossApplianceDeviceIdSubscribeTopic({ deviceId }),
      JSON.stringify(packet),
      localAbortable,
    )
      .errored(error);

  }, abortable);
}

/*--------*/

export interface ISendMqttMerossPacketUsingMinimalMqttClientAndTimeoutOptions extends ISendMqttMerossPacketUsingMinimalMqttClientOptions {
  readonly timeout?: number;
}

export function sendMqttMerossPacketUsingMinimalMqttClientAndTimeout<GResponsePayload extends IAsyncTaskConstraint<GResponsePayload>>(
  {
    timeout = 60 * 1000,
    abortable,
    ...options
  }: ISendMqttMerossPacketUsingMinimalMqttClientAndTimeoutOptions,
): AsyncTask<GResponsePayload> {
  return asyncTaskWithTimeout((abortable: Abortable): AsyncTask<GResponsePayload> => {
    return sendMqttMerossPacketUsingMinimalMqttClient({
      ...options,
      abortable,
    });
  }, timeout, abortable);
}
