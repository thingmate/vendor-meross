import { IMerossElectricityConsumptionConfig } from './meross-electricity-consumption-config.type';

export interface IMerossElectricity {
  channel: number;
  current: number; // in ma
  voltage: number; // in dV
  power: number; // in mW
  config: IMerossElectricityConsumptionConfig;
}
