import { IBase } from './base.interface';

export interface IItem extends IBase{
  name: string;
  info?: object;
  cost: number;
  canBeOwned: boolean;
  canBeMortgaged: boolean;
  canBeUpgraded: boolean;
  additional?: {
    [keys: string] : string;
  };
}
