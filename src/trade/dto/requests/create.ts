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
  openTradeTime: Date;

  @IsDate()
  @IsOptional()
  closeTradeTime: Date;

  @IsNumber()
  openPrice: number;

  @IsNumber()
  @IsOptional()
  closePrice: number;

  @IsString()
  orderType: string;

  @IsString()
  execType: string;

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
  order_id: string;

  @IsString()
  @IsOptional()
  brokerId?: string;
}
