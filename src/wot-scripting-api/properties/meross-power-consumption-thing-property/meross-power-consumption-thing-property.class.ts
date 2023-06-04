import { Abortable, AsyncTask } from '@lirx/async-task';
import { IPowerConsumption, PowerConsumptionThingProperty } from '@thingmate/wot-scripting-api';
import {
  getMerossApplianceControlElectricity,
  IMerossApplianceControlElectricityAbilityGETACKPayload,
} from '../../../device/packet/abilities/appliance-control-electricity/meross-appliance-control-electricity.type';
import {
  IDeviceOptionsForCreateAndSendMerossPacketAbility,
} from '../../../device/packet/abilities/shared/device-options-for-create-and-send-meross-packet-ability';

export interface IMerossPowerConsumptionThingPropertyOptions {
  deviceOptions: IDeviceOptionsForCreateAndSendMerossPacketAbility;
  channel?: number;
}

export class MerossPowerConsumptionThingProperty extends PowerConsumptionThingProperty {
  constructor(
    {
      deviceOptions,
      channel = 0,
    }: IMerossPowerConsumptionThingPropertyOptions,
  ) {
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

    super({
      read,
      // consumption on mss310 has a max refreshTime of 10s
      minObserveRefreshTime: 10000,
    });
  }

}
