import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';
import { AuthData } from '../interfaces/auth-data.interface';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(identityString: string, password: string): Promise<AuthData> {
    const user = await this.authService.validateUser(identityString, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
