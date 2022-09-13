import {
  IsString,
  IsOptional,
  IsArray,
  IsInt
} from 'class-validator';

export class UpdateBody {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  content?: string;

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

  @IsOptional()
  @IsArray()
  photosAdded?: string[];

  @IsOptional()
  @IsArray()
  photosDeleted?: string[];
}
