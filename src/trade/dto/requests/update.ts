import {
  IsString,
  IsOptional,
  IsArray,
  IsNumber
} from 'class-validator';

export class UpdateBody {
  @IsString()
  pair: string;

  @IsString()
  action: string;

  @IsString()
  dateOpen: string;

  @IsNumber()
  open: number;

  @IsString()
  dateClose: string;

  @IsNumber()
  @IsOptional()
  close: number;

  @IsNumber()
  @IsOptional()
  fee: number;

  @IsOptional()
  @IsArray()
  tagsAdded?: string[];

  @IsOptional()
  @IsArray()
  tagsDeleted?: string[];

  @IsOptional()
  @IsArray()
  notesAdded?: string[];

  @IsOptional()
  @IsArray()
  notesDeleted?: string[];
}
