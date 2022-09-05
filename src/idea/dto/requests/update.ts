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
  photos: string[];

  @IsArray()
  tagsAdded?: string[];

  @IsArray()
  tagsDeleted?: string[];

  @IsArray()
  notesAdded?: string[];

  @IsArray()
  notesDeleted?: string[];

  @IsArray()
  photosAdded?: string[];

  @IsArray()
  photosDeleted?: string[];
}
