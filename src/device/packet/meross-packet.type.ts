export type IMerossPacketMethod =
  | 'GET'
  | 'SET'
  | 'GETACK'
  | 'SETACK'
  | 'PUSH'
  | 'ERROR'
  ;

export interface IMerossPacketHeader {
  from: string;
  messageId: string;
  method: IMerossPacketMethod;
  namespace: string; // name of the command
  payloadVersion: 1;
  sign: string; // md5(messageId + key + timestamp)
  timestamp: number; // in s
  timestampMs: number; // ms of the timestamp
}

export interface IMerossPacket<GPayload> {
  header: IMerossPacketHeader;
  payload: GPayload;
}

export type IGenericMerossPacket = IMerossPacket<any>;

