import {IBase} from '../base.interface';

export type TUserConfig = { 
  utc: number
}
export interface IUser extends IBase{
  username: string;
  email: string;
  password?: string;
  config: TUserConfig
}
