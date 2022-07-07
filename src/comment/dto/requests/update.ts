import {
  IsString,
  IsInt
} from 'class-validator';

export class UpdateBody {
  @IsString()
  content?: string;

  @IsInt()
  rating?: number;
}
