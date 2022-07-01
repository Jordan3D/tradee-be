import { IUser } from './user';
import { IAdmin } from './admin';

export type AuthData = | IUser | IAdmin;
