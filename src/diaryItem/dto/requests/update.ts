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

  @IsArray()
  tagsAdded?: string[];

  @IsArray()
  tagsDeleted?: string[];
}
