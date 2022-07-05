import { IUser } from '../../../interfaces/user';
import { UserResponseDto } from './user';

export class LoginResponseDto {
  status: string;
  
  user: UserResponseDto;

  constructor(status: string, user: IUser) {
    this.status = status;
    this.user = new UserResponseDto(user);
  }
}
