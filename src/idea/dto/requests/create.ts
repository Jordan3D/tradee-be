import {
  IsArray,
  IsString,
  IsOptional
} from 'class-validator';

export class CreateBody {  
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  content: string;

  @IsOptional()
  @IsArray()
  tags: string[];

  @IsOptional()
  @IsArray()
  notes: string[];

  @IsOptional()
  @IsArray()
  photos: string[];
}
