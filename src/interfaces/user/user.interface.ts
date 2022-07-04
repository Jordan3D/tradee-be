import {IBase} from '../base.interface';

export interface IUser extends IBase{
  username: string;
  email: string;
  password?: string;
}
