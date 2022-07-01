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
export class CreateAdminBody {
  @IsEmail()
  email: string;
  
  @IsString()
  password: string;
  
  @IsString()
  name: string;
  
  @IsString()
  secret: string;
}
