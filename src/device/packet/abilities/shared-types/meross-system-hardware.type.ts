export interface IMerossSystemHardware {
  readonly type: string;
  readonly subType: string;
  readonly version: string;
  readonly chipType: string;
  readonly uuid: string;
  readonly macAddress: string;
}
