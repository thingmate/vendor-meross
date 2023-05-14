import { IOnOffState } from '@thingmate/wot-scripting-api';
import { MEROSS_TOGGLE_STATE } from '../../../device/packet/abilities/shared/meross-toggle-x.type';

export function merossToggleStateToOnOffState(
  state: MEROSS_TOGGLE_STATE,
): IOnOffState {
  return (state === MEROSS_TOGGLE_STATE.ON)
    ? 'on'
    : 'off';
}
