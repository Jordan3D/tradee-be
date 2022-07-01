import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import config from '../config/index';
import { JwtPayload } from './dto/jwtPayload.dto';
import { AdminService } from '../admin';
import { UsersService } from '../users';

/** passport jwt strategy - for token validation */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  /** JwtStrategy */
  constructor(
    private readonly adminService: AdminService,
    private readonly userService: UsersService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.jwtSecret,
    });
  }

  /**
   * validate - token and payload structure
   * @param {JwtPayload} payload - payload
   * @returns {Promise<JwtPayload>} - decrypted payload
   */
  async validate({userId, role, type}): Promise<JwtPayload> {
    if (typeof userId !== 'string' || type !== 'access')
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    
    let user;
    
    if(role === 'user'){
      user = await this.userService.getById(userId);
    } else if (role === 'admin'){
      user = await this.adminService.getById(userId);
    }
  
    if (user === null) throw new UnauthorizedException('User not found');
    
    return user;
  }
}
