import { asyncFetchJSON, AsyncTask, IAbortableOptions, IAsyncFetchJSONFunction, IAsyncTaskConstraint } from '@lirx/async-task';
import { IHavingUserKey } from '../../../types/having-user-key.type';
import { IGenericMerossPacket } from '../meross-packet.type';
import { verifyMerossPacket } from '../verify-meross-packet';

export interface ISendHttpMerossPacketOptions extends IHavingUserKey, IAbortableOptions {
  hostname: string;
  packet: IGenericMerossPacket;
  fetch?: IAsyncFetchJSONFunction;
}

export function sendHttpMerossPacket<GResponsePayload extends IAsyncTaskConstraint<GResponsePayload>>(
  {
    hostname,
    packet,
    fetch = asyncFetchJSON,
    abortable,
    key,
  }: ISendHttpMerossPacketOptions,
): AsyncTask<GResponsePayload> {
  const url: URL = new URL(`http://${hostname}/config`);

  const request = new Request(url, {
    method: 'POST',
    body: JSON.stringify(packet),
  });

  return fetch<GResponsePayload>(
    request,
    void 0,
    abortable,
  )
    .successful((merossResponsePacket: IGenericMerossPacket): GResponsePayload => {
      if (merossResponsePacket.header.messageId === packet.header.messageId) {
        verifyMerossPacket({
          packet,
          key,
        });
        // TODO ensure than packet is an ACK
        return merossResponsePacket.payload;
      } else {
        throw new Error(`Mismatching message id`);
      }
    });
}
