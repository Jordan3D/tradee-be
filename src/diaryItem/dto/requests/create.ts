import {
  IsArray,
  IsString,
  IsOptional,
  IsISO8601
} from 'class-validator';

export class CreateBody {  
  @IsOptional()
  @IsISO8601({})
  createdAt: Date;
  
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  content: string;

  @IsOptional()
  @IsArray()
  tags: string[];
}
