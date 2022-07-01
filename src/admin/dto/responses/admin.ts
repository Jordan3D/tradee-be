import { AdminEntity } from '../../../model';
import { IAdmin } from '../../../interfaces/admin';

export class AdminResponseDto implements Omit<AdminEntity, 'password'> {
  
  id: string;
  
  name: string;
  
  email: string;
  
  isDeleted: boolean;
  
  createdAt: Date;
  
  updatedAt: Date;

  constructor(admin: IAdmin) {
    this.id = admin.id;
    this.name = admin.name;
    this.email = admin.email;
    this.isDeleted = admin.isDeleted;
    this.createdAt = admin.createdAt;
    this.updatedAt = admin.updatedAt;
  }
}
