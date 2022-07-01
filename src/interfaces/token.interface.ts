import { IBase } from './base.interface';
import { IGameSettings, IGameSettingsValues } from './gameSettings.interface';

export interface IToken extends IBase{
  tokenId: string;
  userId: string;
}
