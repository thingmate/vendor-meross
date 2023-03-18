import { ICreateAndSendMerossPacketWithTimeoutOptions } from '../../create-and-send-meross-packet-with-timeout';

export type ICreateAndSendMerossPacketOptionsForAbility<GRequestPayload> =
  Omit<ICreateAndSendMerossPacketWithTimeoutOptions<GRequestPayload>, 'method' | 'namespace'>;

export type ICreateAndSendMerossPacketOptionsForAbilityWithOptionalPayload<GRequestPayload> =
  Omit<ICreateAndSendMerossPacketOptionsForAbility<GRequestPayload>, 'payload'>
  & Partial<Pick<ICreateAndSendMerossPacketOptionsForAbility<GRequestPayload>, 'payload'>>
  ;

