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
  owner?: string;

  @IsOptional()
  @IsString()
  parent?: string | null;
}
