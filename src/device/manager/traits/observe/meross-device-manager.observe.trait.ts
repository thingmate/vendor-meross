import { IMerossDeviceManagerObserveFunction } from './meross-device-manager.observe.function-definition';

export interface IMerossDeviceManagerObserveTrait {
  readonly observe: IMerossDeviceManagerObserveFunction;
}
