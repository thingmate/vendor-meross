import { ISmartPlugState } from '@thingmate/wot-scripting-api';
import { MEROSS_TOGGLE_STATE } from '../../../device/packet/abilities/shared/meross-toggle-x.type';

export function merossToggleStateToSmartPlugState(
  state: MEROSS_TOGGLE_STATE,
): ISmartPlugState {
  return (state === MEROSS_TOGGLE_STATE.ON)
    ? 'on'
    : 'off';
}
