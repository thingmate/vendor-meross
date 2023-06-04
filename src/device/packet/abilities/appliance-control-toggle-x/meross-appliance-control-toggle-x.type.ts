import { AsyncTask } from '@lirx/async-task';
import {
  IMapFilterPushPipeWithBackPressureFunctionReturn,
  IPushSourceWithBackPressure,
  MAP_FILTER_PUSH_PIPE_WITH_BACK_PRESSURE_DISCARD,
  mapFilterPushPipeWithBackPressure,
} from '@lirx/stream';
import { createAndSendMerossPacketWithTimeout } from '../../create-and-send-meross-packet-with-timeout';
import { IGenericMerossPacket } from '../../meross-packet.type';
import {
  createMqttMerossPUSHPacketListener,
  ICreateMqttMerossPUSHPacketListenerOptions,
} from '../../mqtt/create-mqtt-meross-push-packet-listener';
import { ICreateAndSendMerossPacketOptionsForAbility } from '../shared/create-and-send-meross-packet-options-for-ability.type';
import { IMerossToggleXDigest } from '../shared/meross-toggle-x-digest.type';
import { IMerossToggleX } from '../shared/meross-toggle-x.type';

export const MEROSS_APPLIANCE_CONTROL_TOGGLE_X_ABILITY_NAME = 'Appliance.Control.ToggleX';

export type IMerossApplianceControlToggleXAbilityName = typeof MEROSS_APPLIANCE_CONTROL_TOGGLE_X_ABILITY_NAME;

/** GET */

export interface IMerossApplianceControlToggleXAbilityGETPayload {
  togglex: {
    channel: number;
  };
}

export interface IMerossApplianceControlToggleXAbilityGETACKPayload {
  chanel: number;
  togglex: IMerossToggleXDigest;
}

export type IGetMerossApplianceControlToggleXOptions = ICreateAndSendMerossPacketOptionsForAbility<IMerossApplianceControlToggleXAbilityGETPayload>;

export function getMerossApplianceControlToggleX(
  options: IGetMerossApplianceControlToggleXOptions,
): AsyncTask<IMerossApplianceControlToggleXAbilityGETACKPayload> {
  return createAndSendMerossPacketWithTimeout<IMerossApplianceControlToggleXAbilityGETPayload, IMerossApplianceControlToggleXAbilityGETACKPayload>({
    method: 'GET',
    namespace: MEROSS_APPLIANCE_CONTROL_TOGGLE_X_ABILITY_NAME,
    ...options,
  });
}

/** SET */

export interface IMerossApplianceControlToggleXAbilitySETPayload {
  togglex: IMerossToggleX;
}

export type IMerossApplianceControlToggleXAbilitySETACKPayload = void;

export type ISetMerossApplianceControlToggleXOptions = ICreateAndSendMerossPacketOptionsForAbility<IMerossApplianceControlToggleXAbilitySETPayload>;

export function setMerossApplianceControlToggleX(
  options: ISetMerossApplianceControlToggleXOptions,
): AsyncTask<IMerossApplianceControlToggleXAbilitySETACKPayload> {
  return createAndSendMerossPacketWithTimeout<IMerossApplianceControlToggleXAbilitySETPayload, IMerossApplianceControlToggleXAbilitySETACKPayload>({
    method: 'SET',
    namespace: MEROSS_APPLIANCE_CONTROL_TOGGLE_X_ABILITY_NAME,
    ...options,
  });
}

/** PUSH */

export interface IMerossApplianceControlToggleXAbilityPUSHPayload {
  togglex: IMerossToggleXDigest[];
}

// TODO create generic function, and share packets
export function createMerossApplianceControlToggleXAbilityListener(
  options: ICreateMqttMerossPUSHPacketListenerOptions,
): IPushSourceWithBackPressure<IMerossApplianceControlToggleXAbilityPUSHPayload> {
  return mapFilterPushPipeWithBackPressure(
    createMqttMerossPUSHPacketListener(options),
    (
      packet: IGenericMerossPacket,
    ): IMapFilterPushPipeWithBackPressureFunctionReturn<IMerossApplianceControlToggleXAbilityPUSHPayload> => {
      if (packet.header.namespace === MEROSS_APPLIANCE_CONTROL_TOGGLE_X_ABILITY_NAME) {
        return packet.payload;
      } else {
        return MAP_FILTER_PUSH_PIPE_WITH_BACK_PRESSURE_DISCARD;
      }
    },
  );
}
