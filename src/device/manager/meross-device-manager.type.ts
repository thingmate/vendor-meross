import { IMerossDeviceManagerObserveTrait } from './traits/observe/meross-device-manager.observe.trait';
import { IMerossDeviceManagerQueryTrait } from './traits/query/meross-device-manager.query.trait';

export interface IMerossDeviceManager extends //
  IMerossDeviceManagerQueryTrait,
  IMerossDeviceManagerObserveTrait
  //
{

}
