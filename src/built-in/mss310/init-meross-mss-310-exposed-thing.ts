import { Abortable, AsyncTask } from '@lirx/async-task';
import {
  getOppositeSmartPlugState,
  IExposedThing,
  IExposedThingPropertyOnReadFunctionHandlerOptions,
  ISmartPlugConfig,
  ISmartPlugConsumption,
  ISmartPlugConsumptionHistory,
  ISmartPlugState,
} from '@thingmate/wot-scripting-api';
import {
  getMerossApplianceControlConsumptionX,
  IMerossApplianceControlConsumptionXAbilityGETACKPayload,
} from '../../device/packet/abilities/appliance-control-consumption-x/meross-appliance-control-consumption-x.type';
import {
  getMerossApplianceControlElectricity,
  IMerossApplianceControlElectricityAbilityGETACKPayload,
} from '../../device/packet/abilities/appliance-control-electricity/meross-appliance-control-electricity.type';
import {
  getMerossApplianceControlToggleX,
  IMerossApplianceControlToggleXAbilityGETACKPayload,
  IMerossApplianceControlToggleXAbilityPUSHPayload,
  MEROSS_APPLIANCE_CONTROL_TOGGLE_X_ABILITY_NAME,
  setMerossApplianceControlToggleX,
} from '../../device/packet/abilities/appliance-control-toggle-x/meross-appliance-control-toggle-x.type';
import {
  IDeviceOptionsForCreateAndSendMerossPacketAbility,
} from '../../device/packet/abilities/shared/device-options-for-create-and-send-meross-packet-ability';
import { IMerossElectricityConsumption } from '../../device/packet/abilities/shared/meross-electricity-consumption.type';
import { MEROSS_TOGGLE_STATE } from '../../device/packet/abilities/shared/meross-toggle-x.type';
import { IGenericMerossPacket } from '../../device/packet/meross-packet.type';
import { createMqttMerossPUSHPacketListener } from '../../device/packet/mqtt/create-mqtt-meross-push-packet-listener';

function merossToggleStateToSmartPlugState(
  state: MEROSS_TOGGLE_STATE,
): ISmartPlugState {
  return (state === MEROSS_TOGGLE_STATE.ON)
    ? 'on'
    : 'off';
}

function standardSmartPlugStateToMerossToggleState(
  state: ISmartPlugState,
): MEROSS_TOGGLE_STATE {
  return (state === 'on')
    ? MEROSS_TOGGLE_STATE.ON
    : MEROSS_TOGGLE_STATE.OFF;
}

export interface IInitMerossMss310ExposedThingOptions {
  exposedThing: IExposedThing<ISmartPlugConfig>;
  deviceOptions: IDeviceOptionsForCreateAndSendMerossPacketAbility;
  channel?: number;
}

export function initMerossMss310ExposedThing(
  {
    exposedThing,
    deviceOptions,
    channel = 0,
  }: IInitMerossMss310ExposedThingOptions,
): void {
  const readState = (
    abortable: Abortable,
  ): AsyncTask<ISmartPlugState> => {
    return getMerossApplianceControlToggleX({
      ...deviceOptions,
      payload: {
        togglex: { channel },
      },
      abortable,
    })
      .successful((response: IMerossApplianceControlToggleXAbilityGETACKPayload): ISmartPlugState => {
        return merossToggleStateToSmartPlugState(response.togglex.onoff);
      });
  };

  const writeState = (
    state: ISmartPlugState,
    abortable: Abortable,
  ): AsyncTask<void> => {
    return setMerossApplianceControlToggleX({
      ...deviceOptions,
      payload: {
        togglex: {
          channel,
          onoff: standardSmartPlugStateToMerossToggleState(state),
        },
      },
      abortable,
    })
      .successful(() => {
        stateProperty.emitChange(state);
      });
  };

  const readConsumption = (
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

  const readConsumptionHistory = (
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

  /* STATE */
  const stateProperty = exposedThing.getProperty('state');

  stateProperty.onRead(({ abortable }: IExposedThingPropertyOnReadFunctionHandlerOptions<ISmartPlugState>): AsyncTask<ISmartPlugState> => {
    return readState(abortable);
  });

  stateProperty.onWrite((state: ISmartPlugState, { abortable }): AsyncTask<void> => {
    return writeState(state, abortable);
  });

  /* CONSUMPTION */
  const consumptionProperty = exposedThing.getProperty('consumption');

  consumptionProperty.onRead(({ abortable }: IExposedThingPropertyOnReadFunctionHandlerOptions<ISmartPlugConsumption>): AsyncTask<ISmartPlugConsumption> => {
    return readConsumption(abortable);
  });

  /* CONSUMPTION HISTORY */
  const consumptionHistoryProperty = exposedThing.getProperty('consumptionHistory');

  consumptionHistoryProperty.onRead(({ abortable }: IExposedThingPropertyOnReadFunctionHandlerOptions<ISmartPlugConsumptionHistory[]>): AsyncTask<ISmartPlugConsumptionHistory[]> => {
    return readConsumptionHistory(abortable);
  });

  /* TOGGLE */
  const toggleAction = exposedThing.getAction('toggle');

  toggleAction.onInvoke((state: ISmartPlugState | undefined, { abortable }): AsyncTask<ISmartPlugState> => {
    const getState = (
      abortable: Abortable,
    ): AsyncTask<ISmartPlugState> => {
      return (state === void 0)
        ? readState(abortable)
          .successful(getOppositeSmartPlugState)
        : AsyncTask.success(state, abortable);
    };

    return getState(abortable)
      .successful((state: ISmartPlugState, abortable: Abortable): AsyncTask<ISmartPlugState> => {
        return writeState(state, abortable)
          .successful((): ISmartPlugState => {
            return state;
          });
      });
  });

  /* PUSH */

  const pushNotifications$ = createMqttMerossPUSHPacketListener(deviceOptions);

  pushNotifications$((merossPacket: IGenericMerossPacket, abortable: Abortable): AsyncTask<void> => {
    if (merossPacket.header.namespace === MEROSS_APPLIANCE_CONTROL_TOGGLE_X_ABILITY_NAME) {
      const payload: IMerossApplianceControlToggleXAbilityPUSHPayload = merossPacket.payload;
      const state: ISmartPlugState = merossToggleStateToSmartPlugState(payload.togglex[channel].onoff);
      stateProperty.emitChange(state);
    }
    return AsyncTask.void(abortable);
  }, Abortable.never);

}
