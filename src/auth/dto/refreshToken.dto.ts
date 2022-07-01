import { IsString, IsNotEmpty } from 'class-validator';

/** login payload */
export class RefreshTokenDto {
  /** token */
  @IsString()
  @IsNotEmpty()
  refresh_token: string;
}
