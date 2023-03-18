export const enum MEROSS_TOGGLE_STATE {
  OFF = 0,
  ON = 1,
}

export interface IMerossToggleX {
  channel: number;
  onoff: MEROSS_TOGGLE_STATE;
}
