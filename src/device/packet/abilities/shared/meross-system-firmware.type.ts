export interface IMerossSystemFirmware {
  version: string;
  compileTime: string;
  wifiMac: string;
  innerIp: string;
  server: string;
  port: number;
  secondServer?: string;
  secondPort?: number;
  userId: number;
}
