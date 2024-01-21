import { IMerossDeviceManagerQueryFunction } from './meross-device-manager.query.function-definition';

export interface IMerossDeviceManagerQueryTrait {
  readonly query: IMerossDeviceManagerQueryFunction;
}
