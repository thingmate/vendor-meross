import { IMerossElectricityConsumptionConfig } from './meross-electricity-consumption-config.type';

export interface IMerossElectricity {
  readonly channel: number;
  readonly current: number; // in ma
  readonly voltage: number; // in dV
  readonly power: number; // in mW
  readonly config: IMerossElectricityConsumptionConfig;
}
