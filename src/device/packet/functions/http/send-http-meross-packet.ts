import { asyncFetchJSON, AsyncTask, IAbortableOptions, IAsyncTaskConstraint } from '@lirx/async-task';
import { IUrlRewriter, NO_URL_REWRITE } from '@thingmate/wot-scripting-api';
import { IUserKey } from '../../../../types/user-key.type';
import { IGenericMerossPacket, IMerossPacket } from '../../meross-packet.type';
import { verifyMerossPacket } from '../verify-meross-packet';

export interface ISendHttpMerossPacketOptions extends IAbortableOptions {
  readonly hostname: string;
  readonly packet: IGenericMerossPacket;
  readonly key: IUserKey;
  readonly urlRewriter?: IUrlRewriter;
}

/**
 * Sends a Meross Packet over http.
 *
 * Returns the payload of the response.
 */
export function sendHttpMerossPacket<GResponsePayload extends IAsyncTaskConstraint<GResponsePayload>>(
  {
    hostname,
    packet,
    key,
    urlRewriter = NO_URL_REWRITE,
    abortable,
  }: ISendHttpMerossPacketOptions,
): AsyncTask<GResponsePayload> {
  const url: URL = new URL(urlRewriter(`http://${hostname}/config`));

  const request = new Request(url, {
    method: 'POST',
    body: JSON.stringify(packet),
  });

  return asyncFetchJSON<IMerossPacket<GResponsePayload>>(
    request,
    void 0,
    abortable,
  )
    .successful((merossResponsePacket: IMerossPacket<GResponsePayload>): GResponsePayload => {
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
