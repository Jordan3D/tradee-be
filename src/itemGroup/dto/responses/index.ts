import { IItemGroup } from '../../../interfaces/itemGroup.interface';
import { ItemGroupEntity } from '../../../model/index';

export class CreateResponseDto implements Omit<ItemGroupEntity, 'isDeleted'>{
  id: string;
  
  createdAt: Date;
  
  updatedAt: Date;
  
  color: string;
  
  name: string;
}

export class ItemResponseDto implements Omit<IItemGroup, 'createdAt' | 'updatedAt' |'isDeleted'>{
  id: string;
  color: string;
  name: string;
  
  constructor(data){
    this.id = data.id;
    this.color = data.color;
    this.name = data.name;
  }
}