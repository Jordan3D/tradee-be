import { BaseEntity, ItemEntity } from '../../../model';
import { IsBoolean, IsNumber, IsObject, IsString } from 'class-validator';

export class CreateRequestDto implements Omit<ItemEntity, keyof BaseEntity>{
  @IsString()
  name: string;
  
  @IsObject()
  info?: object;
  
  @IsNumber()
  cost: number;
  
  @IsBoolean()
  canBeOwned: boolean;

  @IsBoolean()
  canBeUpgraded: boolean;
  
  @IsBoolean()
  canBeMortgaged: boolean;
  
  @IsObject()
  additional?: {[keys: string]: string};
}