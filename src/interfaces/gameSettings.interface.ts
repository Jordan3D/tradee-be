import { IBase } from './base.interface';

export interface IGameSettingsConfig {
  minStartMoney: number;
  maxStartMoney: number;
  minCircleMoney: number;
  maxCircleMoney: number;
  minPlayersCount: number;
  maxPlayersCount: number;
}

export interface IGameSettingsValues {
  playersCount: number;
  circleMoney: number;
  startMoney: number;
  isCustomCards: boolean;
  isCustomCardsPlayersOwn: boolean;
  multiCL: number;
  multiProperty: number;
  multiUpcost: number,
  multiMortgage: number,
  multiRent: number;
  multiTax: number;
}

export interface IGameSettings extends IGameSettingsValues, Partial<IGameSettingsConfig> {

}