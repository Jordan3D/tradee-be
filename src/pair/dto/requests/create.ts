import {
  IsString,
} from 'class-validator';

export class CreateBody {  
  @IsString()
  title: string;
}
