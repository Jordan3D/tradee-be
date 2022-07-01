import { IBase } from './base.interface';
import { IPlayer } from './player.interface';
import { IAsset } from './asset.interface';

export interface ITransaction extends IBase{
  from: string;
  to: string;
  asset: string;
}
