import {IBase} from './base.interface';
import { IUser } from './user';

export interface ISPlayer {
  id: string;
  role: 'host' | 'player'
}

export interface IPlayer {
  id: string;
  userId: string;
  status: string; // similar to gamePhase
  gameId?: string;
  role: string;
  color: string;
}

export interface IPlayerUser extends IPlayer {
  user: IUser;
}


