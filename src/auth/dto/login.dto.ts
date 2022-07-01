import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

/** login payload */
export class LoginDto {
  /** email */
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  /** password */
  @IsString()
  @IsNotEmpty()
  password: string;
}
