import { Abortable, AsyncTask } from '@lirx/async-task';
import { IAsyncValueReadFunction, IPowerConsumption } from '@thingmate/wot-scripting-api';
import { IMerossDeviceManager } from '../../../../../device/manager/meross-device-manager.type';
import {
  IMerossApplianceControlElectricityAbilityGETACKPayload,
  IMerossApplianceControlElectricityAbilityGETPayload,
  MEROSS_APPLIANCE_CONTROL_ELECTRICITY_ABILITY_NAME,
} from '../../../../../device/packet/abilities/abilities/appliance-control-electricity/meross-appliance-control-electricity.type';
import { convertMerossElectricityToPowerConsumption } from '../../functions/convert-meross-electricity-to-power-consumption';

export interface ICreateMerossPowerConsumptionAsyncValueReadFunctionOptions {
  readonly manager: IMerossDeviceManager;
  readonly channel?: number;
}

export function createMerossPowerConsumptionAsyncValueReadFunction(
  {
    manager,
    channel = 0,
  }: ICreateMerossPowerConsumptionAsyncValueReadFunctionOptions,
): IAsyncValueReadFunction<IPowerConsumption> {
  return (
    abortable: Abortable,
  ): AsyncTask<IPowerConsumption> => {
    return manager.query<IMerossApplianceControlElectricityAbilityGETACKPayload>({
      method: 'GET',
      namespace: MEROSS_APPLIANCE_CONTROL_ELECTRICITY_ABILITY_NAME,
      payload: {
        electricity: {
          channel,
        },
      } satisfies IMerossApplianceControlElectricityAbilityGETPayload,
      abortable,
    })
      .successful((response: IMerossApplianceControlElectricityAbilityGETACKPayload): IPowerConsumption => {
        return convertMerossElectricityToPowerConsumption(response.electricity);
      });
  };
}
