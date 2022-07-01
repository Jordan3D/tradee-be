import { IBase } from './base.interface';
import { IItem } from './item.interface';

export interface IAsset{
  id: string;
  owner?: string;
  item: string;
  isMortgaged: boolean;
  color?: string;
  lvl?: number;
}

export interface IXAsset{
  id: string;
  owner?: string;
  item: IItem;
  isMortgaged: boolean;
  color?: string;
  lvl?: number
}
