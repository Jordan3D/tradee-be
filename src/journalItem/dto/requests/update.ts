import {
  IsString,
  IsOptional,
  IsArray,
  IsInt
} from 'class-validator';

export class UpdateBody {
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsArray()
  pnls: string[];
  
  @IsOptional()
  @IsArray()
  transactions: string[];

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
