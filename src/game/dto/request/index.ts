import { INewGameConfigs } from '../../../interfaces/game.interface';
import {
  IsArray,
  IsNumber,
  IsObject,
  IsString,
  ValidateNested,
  IsNotEmpty,
  IsBoolean,
  IsUUID,
  IsOptional,
} from 'class-validator';
import { IGameSettings } from '../../../interfaces/gameSettings.interface';
import { Type } from 'class-transformer';

export class GameSettings implements IGameSettings {
  @IsNotEmpty()
  @IsNumber()
  playersCount: number;
  
  @IsNotEmpty()
  @IsNumber()
  circleMoney: number;
  
  @IsNotEmpty()
  @IsNumber()
  startMoney: number;
  
  @IsNotEmpty()
  @IsBoolean()
  isCustomCards: boolean;
  
  @IsNotEmpty()
  @IsBoolean()
  isCustomCardsPlayersOwn: boolean;
  
  @IsNotEmpty()
  @IsNumber()
  multiCL: number;
  
  @IsNotEmpty()
  @IsNumber()
  multiProperty: number;
  
  @IsNotEmpty()
  @IsNumber()
  multiRent: number;
  
  @IsNotEmpty()
  @IsNumber()
  multiTax: number;
  
  @IsNotEmpty()
  @IsNumber()
  multiUpcost: number;
  
  @IsNotEmpty()
  @IsNumber()
  multiMortgage: number;
}

export class NewGameConfigsDTO implements INewGameConfigs{
  @IsNotEmpty()
  @IsString()
  name: string;
  
  @IsString()
  password: string;
  
  @ValidateNested()
  @Type(()=>GameSettings)
  settings: GameSettings;
}

export class SearchGameDTO{
  @IsOptional()
  @IsUUID()
  id: string;
  
  @IsString()
  name: string;
  
  @IsNumber()
  max: number;
}