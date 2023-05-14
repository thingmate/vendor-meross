import { Abortable, AsyncTask } from '@lirx/async-task';
import { IPowerConsumptionHistory, IPowerConsumptionHistoryThingProperty, ThingProperty } from '@thingmate/wot-scripting-api';
import {
  getMerossApplianceControlConsumptionX,
  IMerossApplianceControlConsumptionXAbilityGETACKPayload,
} from '../../../device/packet/abilities/appliance-control-consumption-x/meross-appliance-control-consumption-x.type';
import {
  IDeviceOptionsForCreateAndSendMerossPacketAbility,
} from '../../../device/packet/abilities/shared/device-options-for-create-and-send-meross-packet-ability';
import { IMerossElectricityConsumption } from '../../../device/packet/abilities/shared/meross-electricity-consumption.type';

export interface ICreateMerossPowerConsumptionHistoryThingPropertyOptions {
  deviceOptions: IDeviceOptionsForCreateAndSendMerossPacketAbility;
}

export function createMerossPowerConsumptionHistoryThingProperty(
  {
    deviceOptions,
  }: ICreateMerossPowerConsumptionHistoryThingPropertyOptions,
): IPowerConsumptionHistoryThingProperty {
  const read = (
    abortable: Abortable,
  ): AsyncTask<IPowerConsumptionHistory[]> => {
    return getMerossApplianceControlConsumptionX(
      {
        ...deviceOptions,
        abortable,
      },
    )
      .successful((response: IMerossApplianceControlConsumptionXAbilityGETACKPayload): IPowerConsumptionHistory[] => {
        return response.consumptionx.map(({ date, value }: IMerossElectricityConsumption): IPowerConsumptionHistory => {
          const start: number = Date.parse(date);
          const _start: Date = new Date(start);
          const end: number = new Date(_start.getFullYear(), _start.getMonth(), _start.getDate() + 1).getTime();

          return {
            power: value,
            start,
            end,
          };
        });
      });
  };

  return new ThingProperty<IPowerConsumptionHistory[]>({
    read,
  });
}