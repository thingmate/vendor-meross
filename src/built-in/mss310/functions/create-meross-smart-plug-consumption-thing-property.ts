import { Abortable, AsyncTask } from '@lirx/async-task';
import {
  createReadonlyThingPropertyWriteFunction,
  createThingPropertyObserveUsingReadLoopFunction,
  ISmartPlugConsumption,
  IThingProperty,
  IThingPropertyObserveUsingReadLoopTrait,
} from '@thingmate/wot-scripting-api';
import {
  getMerossApplianceControlElectricity,
  IMerossApplianceControlElectricityAbilityGETACKPayload,
} from '../../../device/packet/abilities/appliance-control-electricity/meross-appliance-control-electricity.type';
import {
  IDeviceOptionsForCreateAndSendMerossPacketAbility,
} from '../../../device/packet/abilities/shared/device-options-for-create-and-send-meross-packet-ability';

export interface IMerossSmartPlugConsumptionThingPropertyOptions {
  deviceOptions: IDeviceOptionsForCreateAndSendMerossPacketAbility;
  channel?: number;
}

export interface IMerossSmartPlugConsumptionThingProperty extends //
  Omit<IThingProperty<ISmartPlugConsumption>, 'observe'>,
  IThingPropertyObserveUsingReadLoopTrait<ISmartPlugConsumption>
//
{

}

export function createMerossSmartPlugConsumptionThingProperty(
  {
    deviceOptions,
    channel = 0,
  }: IMerossSmartPlugConsumptionThingPropertyOptions,
): IMerossSmartPlugConsumptionThingProperty {
  const read = (
    abortable: Abortable,
  ): AsyncTask<ISmartPlugConsumption> => {
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
      .successful((response: IMerossApplianceControlElectricityAbilityGETACKPayload): ISmartPlugConsumption => {
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

  const write = createReadonlyThingPropertyWriteFunction<ISmartPlugConsumption>({
    name: 'consumption',
  });

  const observe = createThingPropertyObserveUsingReadLoopFunction<ISmartPlugConsumption>({
    read,
    defaultRefreshTime: 10000, // consumption on mss310 has a max refreshTime of 10s
  });

  return {
    read,
    write,
    observe,
  };
}
