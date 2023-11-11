import { IThingDescription } from '@thingmate/wot-scripting-api';

export interface IMerossThingDescription extends IThingDescription {
  id: string;
  firmwareVersion: string;
  hardwareVersion: string;
  deviceType: string;
  online: boolean;
}
