import {
  IsArray,
  IsNotEmpty,
  IsString,
  Validate,
  ArrayNotEmpty,
  ArrayUnique,
  IsEmail
} from 'class-validator';

/** input for create student endpoint */
export class CreateUserBody {
  @IsEmail()
  email: string;
  
  @IsString()
  password: string;

  @IsString()
  username: string;
}
