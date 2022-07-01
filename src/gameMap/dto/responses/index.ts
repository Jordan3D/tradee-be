import { GameMapEntity } from '../../../model';
import { IGameMap } from '../../../interfaces/gameMap.interface';

export class CreateResponseDto implements GameMapEntity{
  id: string;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
  name: string;
  steps: string[];
  lotteries: string[];
  chances: string[];
}

export class ItemResponseDto implements Omit<IGameMap, 'createdAt' | 'updatedAt' |'isDeleted'>{
  id: string;
  name: string;
  steps: string[];
  lotteries: string[];
  chances: string[];
  
  constructor(data){
    this.id = data.id;
    this.name = data.name;
    this.steps = data.steps;
    this.lotteries = data.lotteries;
    this.chances = data.chances;
  }
}

export class UpdateResponseDto implements GameMapEntity{
  id: string;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
  name: string;
  steps: string[];
  lotteries: string[];
  chances: string[];
}