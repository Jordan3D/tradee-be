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
import { AdminService } from '../admin';
import { AccessTokenPayloadDto } from './dto/accessTockenPayload.dto';

/** passport jwt strategy - for token validation */
@Injectable()
export class AdminJwtStrategy extends PassportStrategy(
  Strategy,
  'admin_jwt',
) {
  /** JwtStrategy */
  constructor(
    private readonly adminService: AdminService,
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
    const user = await this.adminService.getById(userId);
  
    if (user === null) throw new UnauthorizedException('Admin not found');
  
    return user;
  }
}
