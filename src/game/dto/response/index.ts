import { IGameSettings } from '../../../interfaces/gameSettings.interface';
import { IBase } from '../../../interfaces/base.interface';
import { IsBoolean, IsNotEmpty, IsNumber, IsObject, IsString } from 'class-validator';

export class GameSettingsDTO{
  @IsNumber()
  playersCount: number;
  @IsNumber()
  minPlayersCount?: number;
  @IsNumber()
  maxPlayersCount?: number;
  @IsNumber()
  minCircleMoney?: number;
  @IsNumber()
  maxCircleMoney?: number;
  @IsNumber()
  minStartMoney?: number;
  @IsNumber()
  maxStartMoney?: number;
  @IsNumber()
  maxMultiRent: number;
  @IsNumber()
  minMultiRent: number;
  @IsNumber()
  maxMultiTax: number;
  @IsNumber()
  minMultiTax: number;
  @IsNumber()
  maxMultiCL: number;
  @IsNumber()
  minMultiCL: number;
  @IsNumber()
  maxMultiProperty: number;
  @IsNumber()
  minMultiProperty: number;
  @IsNumber()
  maxMultiUpcost: number;
  @IsNumber()
  minMultiUpcost: number;
  @IsNumber()
  maxMultiMortgage: number;
  @IsNumber()
  minMultiMortgage: number;
  @IsObject()
  gameTypes: any;
  @IsObject()
  examples: any;
}

export class NewGameResponseDTO {
  @IsNotEmpty()
  @IsString()
  gameId: string;
  @IsNotEmpty()
  @IsString()
  playerId: string;
}

export class GameConfigsDTO {
  @IsObject()
  constants: {
    action: any
  }
}