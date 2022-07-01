import { AdminResponseDto } from '../../../admin/dto/responses';

/** login response */
export class AdminLoginResponseDto {
  access_token: string;
  expiresIn: number;
  refresh_token: string;
  admin: AdminResponseDto;

  constructor(
    admin: AdminResponseDto,
    access_token: string,
    refresh_token: string,
    expiresIn: number,
  ) {
    this.admin = new AdminResponseDto(admin);
    this.access_token = access_token;
    this.refresh_token = refresh_token;
    this.expiresIn = expiresIn;
  }
}
