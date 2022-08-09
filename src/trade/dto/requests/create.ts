import {
  IsString,
  IsOptional,
  IsNumber,
  IsArray
} from 'class-validator';

export class CreateBody {  
  @IsString()
  pairId: string;

  @IsString()
  action: string;

  @IsString()
  dateOpen: string;

  @IsNumber()
  open: number;

  @IsString()
  @IsOptional()
  dateClose: string;

  @IsNumber()
  @IsOptional()
  close: number;

  @IsNumber()
  @IsOptional()
  fee: number;
  
  @IsArray()
  @IsOptional()
  tags: string[];

  @IsArray()
  @IsOptional()
  notes: string[];
}
