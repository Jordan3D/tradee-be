import * as uuid from 'uuid';
import { IPlayer } from '../../interfaces/player.interface';
import { playerColors } from '../game.constants';

export default class Player implements IPlayer{
  id: string;
  userId: string;
  status: string;
  gameId: string;
  role: string;
  color: string;
  
  constructor(values: Omit<IPlayer, 'id'>){
    this.id = uuid.v4();
    this.userId = values.userId;
    this.status = values.status;
    this.gameId = values.gameId;
    this.role = values.role;
    this.color = values.color;
  }
}