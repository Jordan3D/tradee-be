import { BaseEntity, GameMapEntity } from '../../../model';
import { IsArray, IsObject, IsString } from 'class-validator';

export class CreateRequestDto implements Omit<GameMapEntity, keyof BaseEntity>{
  @IsString()
  name: string;
  
  @IsArray()
  steps: string[];
  
  @IsArray()
  lotteries: string[];
  
  @IsArray()
  chances: string[];
}

export class UpdateRequestDto implements Omit<GameMapEntity, keyof BaseEntity>{
  @IsString()
  name: string;
  
  @IsArray()
  steps: string[];
  
  @IsArray()
  allItems: string[];
  
  @IsArray()
  lotteries: string[];
  
  @IsArray()
  chances: string[];
}