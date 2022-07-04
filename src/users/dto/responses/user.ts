import { IUser } from '../../../interfaces/user';
import { UserEntity } from '../../../model';

export class UserResponseDto implements Omit<UserEntity, 'password'> {
  
  id: string;
  
  username: string;
  
  email: string;
  
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
  }
}


export class UploadedAvatarDto {
  key: string;
  url: string;
}