import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import config from '../config/index';
import { AuthData } from '../interfaces/auth-data.interface';
import { UsersService } from '../users';
import { AccessTokenPayloadDto } from './dto/accessTockenPayload.dto';

/** passport jwt strategy - for token validation */
@Injectable()
export class UserJwtStrategy extends PassportStrategy(
  Strategy,
  'user_jwt',
) {
  /** JwtStrategy */
  constructor(
    private readonly userService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.jwtSecret,
    });
  }

  /**
   * validate - token and payload structure
   * @param {AccessTockenPayloadDto} payload - payload
   * @returns {Promise<AccessTockenPayloadDto>} - decrypted payload
   */

  async validate({ userId, type }: AccessTokenPayloadDto): Promise<AuthData> {
    if (typeof userId !== 'string' || type !== 'access')
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
  
    const user = await this.userService.getById(userId);
  
    if (user === null) throw new UnauthorizedException('User not found');
  
    return user;
  }
}
