import { Abortable, AsyncTask } from '@lirx/async-task';
import { IPushSourceWithBackPressure } from '@lirx/stream/src/push-source/push-source-with-back-pressure.type';
import {
  createReadonlyThingPropertyWriteFunction,
  createUnobservableThingPropertyObserveFunction,
  ISmartPlugConsumptionHistory,
  IThingProperty,
} from '@thingmate/wot-scripting-api';
import {
  getMerossApplianceControlConsumptionX,
  IMerossApplianceControlConsumptionXAbilityGETACKPayload,
} from '../../../device/packet/abilities/appliance-control-consumption-x/meross-appliance-control-consumption-x.type';
import {
  IDeviceOptionsForCreateAndSendMerossPacketAbility,
} from '../../../device/packet/abilities/shared/device-options-for-create-and-send-meross-packet-ability';
import { IMerossElectricityConsumption } from '../../../device/packet/abilities/shared/meross-electricity-consumption.type';

export interface IMerossSmartPlugConsumptionHistoryThingPropertyOptions {
  deviceOptions: IDeviceOptionsForCreateAndSendMerossPacketAbility;
}

export function createMerossSmartPlugConsumptionHistoryThingProperty(
  {
    deviceOptions,
  }: IMerossSmartPlugConsumptionHistoryThingPropertyOptions,
): IThingProperty<ISmartPlugConsumptionHistory[]> {
  const read = (
    abortable: Abortable,
  ): AsyncTask<ISmartPlugConsumptionHistory[]> => {
    return getMerossApplianceControlConsumptionX(
      {
        ...deviceOptions,
        abortable,
      },
    )
      .successful((response: IMerossApplianceControlConsumptionXAbilityGETACKPayload): ISmartPlugConsumptionHistory[] => {
        return response.consumptionx.map(({ date, value }: IMerossElectricityConsumption): ISmartPlugConsumptionHistory => {
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

  const write = createReadonlyThingPropertyWriteFunction<ISmartPlugConsumptionHistory[]>({
    name: 'consumptionHistory',
  });

  const observe = createUnobservableThingPropertyObserveFunction<ISmartPlugConsumptionHistory[]>({
    name: 'consumptionHistory',
  });

  return {
    read,
    write,
    observe,
  };
}
