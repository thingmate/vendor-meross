import { ICreateAndSendMerossPacketOptionsForAbility } from './create-and-send-meross-packet-options-for-ability.type';

export type IDeviceOptionsForCreateAndSendMerossPacketAbility =
  Omit<ICreateAndSendMerossPacketOptionsForAbility<any>, 'payload' | 'abortable'>
  ;
