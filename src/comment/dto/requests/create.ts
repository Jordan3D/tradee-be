import {
  IsString
} from 'class-validator';

export class CreateBody {  
  @IsString()
  content: string;

  @IsString()
  parentId: string;

  parentType: 'note' | 'idea' 
}
