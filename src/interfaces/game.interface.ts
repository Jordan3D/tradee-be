import { IBase } from './base.interface';
import { IGameSettings, IGameSettingsValues } from './gameSettings.interface';
import { IPlayer, IPlayerUser, ISPlayer} from './player.interface';
import { IAsset } from './asset.interface';

export interface ISPlayers {
  [keys: string] : ISPlayer
}

export interface IDPlayers {
  [keys: string] : IPlayer;
}

export interface IXPlayers {
  [keys: string] : IPlayerUser;
}

export interface INewGameConfigs extends Omit<IGame, keyof IBase | 'phase' | 'subphase' | 'players' |'service' | 'isPrivate'> {
}

export interface IGame extends IBase{
  name: string;
  password: string;
  isPrivate: boolean;
  phase: string;
  subphase: string;
  service: string;
  players: ISPlayers;
  settings: IGameSettings;
}

/// для connectionSynchronize
export interface IXGame extends Omit<IGame, 'players'>{
  players: IXPlayers;
}

export interface IEventConatiner {
  event: any,
  to: string
}