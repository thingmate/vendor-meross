import { IMerossToggleX } from './meross-toggle-x.type';

export interface IMerossToggleXDigest extends IMerossToggleX {
  readonly lmTime: number; // last modification time (timestamp in s)
}
