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
  ideas: string[];

  @IsArray()
  tagsAdded?: string[];

  @IsArray()
  tagsDeleted?: string[];

  @IsArray()
  notesAdded?: string[];

  @IsArray()
  notesDeleted?: string[];
}
