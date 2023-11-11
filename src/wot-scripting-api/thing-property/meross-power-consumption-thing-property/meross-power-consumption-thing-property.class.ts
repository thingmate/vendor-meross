import { Abortable, AsyncTask } from '@lirx/async-task';
import { IPowerConsumption, IPowerConsumptionThingProperty } from '@thingmate/wot-scripting-api';
import {
  getMerossApplianceControlElectricity,
  IMerossApplianceControlElectricityAbilityGETACKPayload,
} from '../../../device/packet/abilities/appliance-control-electricity/meross-appliance-control-electricity.type';
import {
  IDeviceOptionsForCreateAndSendMerossPacketAbility,
} from '../../../device/packet/abilities/shared/device-options-for-create-and-send-meross-packet-ability';

export interface ICreateMerossPowerConsumptionThingPropertyOptions {
  deviceOptions: IDeviceOptionsForCreateAndSendMerossPacketAbility;
  channel?: number;
}

export function createMerossPowerConsumptionThingProperty(
  {
    deviceOptions,
    channel = 0,
  }: ICreateMerossPowerConsumptionThingPropertyOptions,
): IPowerConsumptionThingProperty {
  const read = (
    abortable: Abortable,
  ): AsyncTask<IPowerConsumption> => {
    return getMerossApplianceControlElectricity(
      {
        ...deviceOptions,
        payload: {
          electricity: {
            channel,
          },
        },
        abortable,
      },
    )
      .successful((response: IMerossApplianceControlElectricityAbilityGETACKPayload): IPowerConsumption => {
        const {
          current,
          voltage,
          power,
        } = response.electricity;
        return {
          current: current / 1000,
          voltage: voltage / 10,
          power: power / 1000,
        };
      });
  };

  return {
    read,
  };
}

