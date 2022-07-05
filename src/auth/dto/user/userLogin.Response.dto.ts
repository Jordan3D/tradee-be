import { UserResponseDto } from '../../../user/dto/responses';

/** login response */
export class UserLoginResponseDto {
  access_token: string;
  expiresIn: number;
  refresh_token: string;
  user: UserResponseDto;

  constructor(
    user: UserResponseDto,
    access_token: string,
    refresh_token: string,
    expiresIn: number,
  ) {
    this.user = new UserResponseDto(user);
    this.access_token = access_token;
    this.refresh_token = refresh_token;
    this.expiresIn = expiresIn;
  }
}
