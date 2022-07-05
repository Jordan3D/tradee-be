import { TUserConfig } from 'src/interfaces/user/user.interface';
import { IUser } from '../../../interfaces/user';
import { UserEntity } from '../../../model';

export class UserResponseDto implements Omit<UserEntity, 'password'> {
  
  id: string;
  
  username: string;
  
  email: string;

  config: TUserConfig;
  
  isDeleted: boolean;
  
  createdAt: Date;
  
  updatedAt: Date;

  constructor(user: IUser) {
    this.id = user.id;
    this.username = user.username;
    this.email = user.email;
    this.isDeleted = user.isDeleted;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
    this.config = user.config;
  }
}


export class UploadedAvatarDto {
  key: string;
  url: string;
}