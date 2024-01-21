export enum MEROSS_TOGGLE_STATE {
  OFF = 0,
  ON = 1,
}

export interface IMerossToggleX {
  readonly channel: number;
  readonly onoff: MEROSS_TOGGLE_STATE;
}
