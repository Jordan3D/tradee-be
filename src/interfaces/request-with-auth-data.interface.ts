import { Request } from 'express';
import { AuthData } from './auth-data.interface';

export interface RequestWithAuthData extends Request {
  user: AuthData;
}
