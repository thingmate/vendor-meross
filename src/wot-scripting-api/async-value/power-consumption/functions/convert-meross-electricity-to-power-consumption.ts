import { IPowerConsumption } from '@thingmate/wot-scripting-api';
import { IMerossElectricity } from '../../../../device/packet/abilities/shared-types/meross-electricity.type';

export function convertMerossElectricityToPowerConsumption(
  electricity: IMerossElectricity,
): IPowerConsumption {
  return {
    current: electricity.current / 1000,
    voltage: electricity.voltage / 10,
    power: electricity.power / 1000,
  };
}
