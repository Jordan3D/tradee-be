import {
  IsString,
  IsOptional,
  IsArray,
  IsInt
} from 'class-validator';

export class UpdateBody {
  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsInt()
  rating?: number;

  @IsOptional()
  @IsArray()
  tagsAdded?: string[];

  @IsOptional()
  @IsArray()
  tagsDeleted?: string[];
}
