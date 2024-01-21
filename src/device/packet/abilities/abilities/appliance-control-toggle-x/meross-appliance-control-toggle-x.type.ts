import { IMerossToggleXDigest } from '../../shared-types/meross-toggle-x-digest.type';
import { IMerossToggleX } from '../../shared-types/meross-toggle-x.type';

/**
 * Used to read/write the on/off state of a device.
 */

export const MEROSS_APPLIANCE_CONTROL_TOGGLE_X_ABILITY_NAME = 'Appliance.Control.ToggleX';

export type IMerossApplianceControlToggleXAbilityName = typeof MEROSS_APPLIANCE_CONTROL_TOGGLE_X_ABILITY_NAME;

/** GET */

export interface IMerossApplianceControlToggleXAbilityGETPayload {
  readonly togglex: {
    readonly channel: number;
  };
}

export interface IMerossApplianceControlToggleXAbilityGETACKPayload {
  readonly chanel: number;
  readonly togglex: IMerossToggleXDigest;
}

/** SET */

export interface IMerossApplianceControlToggleXAbilitySETPayload {
  readonly togglex: IMerossToggleX;
}

export type IMerossApplianceControlToggleXAbilitySETACKPayload = void;

/** PUSH */

export interface IMerossApplianceControlToggleXAbilityPUSHPayload {
  readonly togglex: IMerossToggleXDigest[];
}

// // TODO create generic function, and share packets
// export function createMerossApplianceControlToggleXAbilityListener(
//   options: ICreateMqttMerossPUSHPacketListenerOptions,
// ): IPushSourceWithBackPressure<IMerossApplianceControlToggleXAbilityPUSHPayload> {
//   return mapFilterPushPipeWithBackPressure(
//     createMqttMerossPUSHPacketListener(options),
//     (
//       packet: IGenericMerossPacket,
//     ): IMapFilterPushPipeWithBackPressureFunctionReturn<IMerossApplianceControlToggleXAbilityPUSHPayload> => {
//       if (packet.header.namespace === MEROSS_APPLIANCE_CONTROL_TOGGLE_X_ABILITY_NAME) {
//         return packet.payload;
//       } else {
//         return MAP_FILTER_PUSH_PIPE_WITH_BACK_PRESSURE_DISCARD;
//       }
//     },
//   );
// }
