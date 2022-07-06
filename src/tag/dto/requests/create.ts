import {
  IsArray,
  IsOptional,
  IsString,
  IsBoolean
} from 'class-validator';

export class CreateBody {
  @IsString()
  title: string;
  
  @IsOptional()
  @IsBoolean()
  isMeta?: boolean;

  @IsOptional()
  @IsString()
  parent?: string | null;;
}
