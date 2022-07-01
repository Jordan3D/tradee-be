import { IUser } from '../../../interfaces/user';
import { UserEntity } from '../../../model';

export class UserResponseDto implements Omit<UserEntity, 'password'> {
  
  id: string;
  
  name: string;
  
  email: string;
  
  avatar: string;
  
  isDeleted: boolean;
  
  createdAt: Date;
  
  updatedAt: Date;
  
  options: {[keys: string]: string};

  constructor(user: IUser) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.avatar = user.avatar;
    this.isDeleted = user.isDeleted;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
    this.options = user.options;
  }
}


export class UploadedAvatarDto {
  key: string;
  url: string;
}