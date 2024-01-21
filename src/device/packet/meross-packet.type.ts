

/**
 * A packet used to control a device: contains a header and a payload.
 *
 * Sent over http or mqtt.
 */
export interface IMerossPacket<GPayload> {
  readonly header: IMerossPacketHeader;
  readonly payload: GPayload;
}

export type IGenericMerossPacket = IMerossPacket<any>;

/**
 * The header of a Meross Packet: contains the details of a packet.
 */
export interface IMerossPacketHeader {
  readonly from: string;
  readonly messageId: string;
  readonly method: IMerossPacketMethod;
  readonly namespace: string; // name of the command
  readonly payloadVersion: 1;
  readonly sign: string; // md5(messageId + key + timestamp)
  readonly timestamp: number; // in s
  readonly timestampMs: number; // ms of the timestamp
}

export type IMerossPacketMethod =
  | 'GET'
  | 'SET'
  | 'GETACK'
  | 'SETACK'
  | 'PUSH'
  | 'ERROR'
  ;


