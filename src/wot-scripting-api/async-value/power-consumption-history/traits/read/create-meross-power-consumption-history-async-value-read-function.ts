import { Abortable, AsyncTask } from '@lirx/async-task';
import { IAsyncValueReadFunction, IPowerConsumptionHistory } from '@thingmate/wot-scripting-api';
import { IMerossDeviceManager } from '../../../../../device/manager/meross-device-manager.type';
import {
  IMerossApplianceControlConsumptionXAbilityGETACKPayload,
  IMerossApplianceControlConsumptionXAbilityGETPayload,
  MEROSS_APPLIANCE_CONTROL_CONSUMPTION_X_ABILITY_NAME,
} from '../../../../../device/packet/abilities/abilities/appliance-control-consumption-x/meross-appliance-control-consumption-x.type';
import {
  convertMerossElectricityConsumptionToPowerConsumptionHistory,
} from '../../functions/convert-meross-electricity-consumption-to-power-consumption-history';

export interface ICreateMerossPowerConsumptionHistoryAsyncValueReadFunctionOptions {
  readonly manager: IMerossDeviceManager;
}

export function createMerossPowerConsumptionHistoryAsyncValueReadFunction(
  {
    manager,
  }: ICreateMerossPowerConsumptionHistoryAsyncValueReadFunctionOptions,
): IAsyncValueReadFunction<readonly IPowerConsumptionHistory[]> {
  return (
    abortable: Abortable,
  ): AsyncTask<readonly IPowerConsumptionHistory[]> => {
    return manager.query<IMerossApplianceControlConsumptionXAbilityGETACKPayload>({
      method: 'GET',
      namespace: MEROSS_APPLIANCE_CONTROL_CONSUMPTION_X_ABILITY_NAME,
      payload: {} satisfies IMerossApplianceControlConsumptionXAbilityGETPayload,
      abortable,
    })
      .successful((response: IMerossApplianceControlConsumptionXAbilityGETACKPayload): readonly IPowerConsumptionHistory[] => {
        return response.consumptionx.map(convertMerossElectricityConsumptionToPowerConsumptionHistory);
      });
  };
}
