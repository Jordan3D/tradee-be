import { TUserConfig } from 'src/interfaces/user/user.interface';
import { IUser } from '../../../interfaces/user';
import { UserEntity } from 'src/models';

export class UserResponseDto implements Omit<IUser, 'password'> {
  
  id: string;
  
  username: string;
  
  email: string;

  config: TUserConfig;
  
  createdAt: Date;
  
  updatedAt: Date;

  constructor(user: IUser) {
    this.id = user.id;
    this.username = user.username;
    this.email = user.email;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
    this.config = user.config;
  }
}


export class UploadedAvatarDto {
  key: string;
  url: string;
}