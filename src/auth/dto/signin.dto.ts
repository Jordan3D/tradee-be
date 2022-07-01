import { IsNotEmpty, IsString, IsEmail, IsOptional } from 'class-validator';

/** login payload */
export class SignInDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
  
  @IsOptional()
  @IsString()
  secret: string;
}
