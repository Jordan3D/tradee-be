import {
  IsArray,
  IsOptional,
  IsString,
  IsBoolean
} from 'class-validator';

export class UpdateBody {
  @IsOptional()
  @IsString()
  title?: string;
  
  @IsOptional()
  @IsBoolean()
  isMeta?: boolean;

  @IsOptional()
  @IsString()
  parentId?: string | null;
}
