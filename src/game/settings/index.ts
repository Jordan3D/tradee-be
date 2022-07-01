import { IGameSettings } from '../../interfaces/gameSettings.interface';

export default class GameSettings implements IGameSettings{
  playersCount: number;
  circleMoney: number;
  startMoney: number;
  isCustomCards: boolean;
  isCustomCardsPlayersOwn: boolean;
  multiCL: number;
  multiProperty: number;
  multiUpcost: number;
  multiMortgage: number;
  multiRent: number;
  multiTax: number;
  
  constructor(values: IGameSettings){
    this.multiCL = values.multiCL;
    this.multiProperty = values.multiProperty;
    this.multiUpcost = values.multiUpcost;
    this.multiMortgage = values.multiMortgage;
    this.multiRent = values.multiRent;
    this.multiTax = values.multiTax;
    this.playersCount = values.playersCount;
    this.circleMoney = values.circleMoney;
    this.startMoney = values.startMoney;
    this.isCustomCards = values.isCustomCards;
    this.isCustomCardsPlayersOwn = values.isCustomCardsPlayersOwn;
  }
}