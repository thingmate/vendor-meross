import { ISmartPlugState } from '@thingmate/wot-scripting-api';
import { MEROSS_TOGGLE_STATE } from '../../../device/packet/abilities/shared/meross-toggle-x.type';

export function standardSmartPlugStateToMerossToggleState(
  state: ISmartPlugState,
): MEROSS_TOGGLE_STATE {
  return (state === 'on')
    ? MEROSS_TOGGLE_STATE.ON
    : MEROSS_TOGGLE_STATE.OFF;
}
