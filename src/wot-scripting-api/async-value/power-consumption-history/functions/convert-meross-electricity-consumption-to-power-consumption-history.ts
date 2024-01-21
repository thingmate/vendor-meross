import { IPowerConsumptionHistory } from '@thingmate/wot-scripting-api';
import { IMerossElectricityConsumption } from '../../../../device/packet/abilities/shared-types/meross-electricity-consumption.type';

export function convertMerossElectricityConsumptionToPowerConsumptionHistory(
  consumption: IMerossElectricityConsumption,
): IPowerConsumptionHistory {
  const start: number = Date.parse(consumption.date);
  const _start: Date = new Date(start);
  const end: number = new Date(_start.getFullYear(), _start.getMonth(), _start.getDate() + 1).getTime();

  return {
    power: consumption.value,
    start,
    end,
  };
}
