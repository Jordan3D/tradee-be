import {IBase} from '../base.interface';

export interface IAdmin extends IBase{
  name: string;
  email?: string;
  password?: string;
}
