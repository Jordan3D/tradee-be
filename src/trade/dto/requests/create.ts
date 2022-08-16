import {
  IsString,
  IsOptional,
  IsNumber,
  IsArray,
  IsBoolean,
  IsDate
} from 'class-validator';

export class CreateBody {  
  @IsString()
  pairId: string;

  @IsString()
  action: string;

  @IsDate()
  tradeTime: Date;

  @IsNumber()
  open: number;

  @IsNumber()
  @IsOptional()
  close: number;

  @IsNumber()
  @IsOptional()
  fee: number;

  @IsString()
  orderType: string;

  @IsNumber()
  leverage: number;

  @IsNumber()
  pnl: number;
  
  @IsArray()
  @IsOptional()
  tags: string[];

  @IsArray()
  @IsOptional()
  notes: string[];

  @IsBoolean()
  @IsOptional()
  isManual: boolean;

  @IsString()
  @IsOptional()
  brokerId?: string;
}
