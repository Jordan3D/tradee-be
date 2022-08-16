import {
  IsString,
  IsOptional,
  IsArray,
  IsNumber
} from 'class-validator';

export class UpdateBody {
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

  @IsString()
  @IsOptional()
  brokerId?: string;
}
