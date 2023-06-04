import { IOnOffState } from '@thingmate/wot-scripting-api';
import { MEROSS_TOGGLE_STATE } from '../../../device/packet/abilities/shared/meross-toggle-x.type';

export function onOffStateToMerossToggleState(
  state: IOnOffState,
): MEROSS_TOGGLE_STATE {
  return (state === 'on')
    ? MEROSS_TOGGLE_STATE.ON
    : MEROSS_TOGGLE_STATE.OFF;
}
