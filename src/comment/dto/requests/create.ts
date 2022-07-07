import {
  IsString
} from 'class-validator';

export class CreateBody {  
  @IsString()
  content: string;

  @IsString()
  parent: string;
}
