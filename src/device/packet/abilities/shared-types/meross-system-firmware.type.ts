export interface IMerossSystemFirmware {
  readonly version: string;
  readonly compileTime: string;
  readonly wifiMac: string;
  readonly innerIp: string;
  readonly server: string;
  readonly port: number;
  readonly secondServer?: string;
  readonly secondPort?: number;
  readonly userId: number;
}
