import { IItem } from '../../../interfaces/item.interface';
import { ItemEntity } from '../../../model';

export class CreateResponseDto implements Omit<ItemEntity, 'isDeleted'>{
  id: string;
  
  createdAt: Date;
  
  updatedAt: Date;
  
  name: string;
  info?: object;
  cost: number;
  canBeOwned: boolean;
  canBeMortgaged: boolean;
  canBeUpgraded: boolean;
  additional?: {[keys: string]: string};
}

export class ItemResponseDto implements Omit<IItem, 'createdAt' | 'updatedAt' |'isDeleted'>{
  id: string;
  name: string;
  info?: object;
  cost: number;
  canBeOwned: boolean;
  canBeMortgaged: boolean;
  canBeUpgraded: boolean;
  additional?: {[keys: string]: string};
  
  constructor(data){
    this.id = data.id;
    this.name = data.name;
    this.info = data.info;
    this.cost = data.cost;
    this.canBeOwned = data.canBeOwned;
    this.canBeMortgaged = data.canBeMortgaged;
    this.canBeUpgraded = data.canBeUpgraded;
    this.additional = data.additional;
  }
}