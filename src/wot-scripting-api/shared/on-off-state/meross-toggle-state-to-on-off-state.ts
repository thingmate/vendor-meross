import { IOnOff } from '@thingmate/wot-scripting-api';
import { MEROSS_TOGGLE_STATE } from '../../../device/packet/abilities/shared/meross-toggle-x.type';

export function merossToggleStateToOnOffState(
  state: MEROSS_TOGGLE_STATE,
): IOnOff {
  return (state === MEROSS_TOGGLE_STATE.ON)
    ? 'on'
    : 'off';
}
