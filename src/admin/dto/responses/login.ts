import { IAdmin } from '../../../interfaces/admin';
import { AdminResponseDto } from './admin';

export class LoginResponseDto {
  status: string;
  
  admin: AdminResponseDto;

  constructor(status: string, admin: IAdmin) {
    this.status = status;
    this.admin = new AdminResponseDto(admin);
  }
}
