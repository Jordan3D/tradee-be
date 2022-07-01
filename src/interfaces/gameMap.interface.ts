import { IXAsset } from './asset.interface';

export interface IGameMap {
  id: string;
  name: string,
  steps: string[], // with item names
  lotteries: string[] // with item names
  chances: string[] // with item names
}

export interface IXGameMap {
  id: string;
  name: string,
  steps: string[], // with asset id
  lotteries: string[] // with asset id
  chances: string[] // with asset id
}