import { asyncFetchJSON, AsyncTask, IAbortableOptions, IAsyncTaskConstraint } from '@lirx/async-task';
import { IHavingUserKey } from '../../../types/having-user-key.type';
import { IGenericMerossPacket } from '../meross-packet.type';
import { verifyMerossPacket } from '../verify-meross-packet';

export interface IForgeHttpMerossPacketUrlFunction {
  (
    url: URL,
  ): URL;
}

export const DEFAULT_FORGE_HTTP_MEROSS_PACKET_URL_FUNCTION: IForgeHttpMerossPacketUrlFunction = ((url: URL): URL => {
  return url;
});

/*---*/

export interface ISendHttpMerossPacketOptions extends IHavingUserKey, IAbortableOptions {
  hostname: string;
  packet: IGenericMerossPacket;
  forgeHttpMerossPacketUrlFunction?: IForgeHttpMerossPacketUrlFunction;
}

export function sendHttpMerossPacket<GResponsePayload extends IAsyncTaskConstraint<GResponsePayload>>(
  {
    hostname,
    packet,
    forgeHttpMerossPacketUrlFunction = DEFAULT_FORGE_HTTP_MEROSS_PACKET_URL_FUNCTION,
    abortable,
    key,
  }: ISendHttpMerossPacketOptions,
): AsyncTask<GResponsePayload> {
  // const url: URL = getCorsProxyUrl(`http://${hostname}/config`);
  const url: URL = forgeHttpMerossPacketUrlFunction(new URL(`http://${hostname}/config`));

  const request = new Request(url, {
    method: 'POST',
    body: JSON.stringify(packet),
  });

  return asyncFetchJSON<GResponsePayload>(
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
