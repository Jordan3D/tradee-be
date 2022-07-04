import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import config from '../config';
import { UsersService } from '../users';
import { UserEntity } from 'src/model';

/** passport jwt strategy - for token validation */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UsersService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.jwtSecret,
    });
  }

  async validate({userId, type}): Promise<UserEntity | undefined> {
    if (typeof userId !== 'string' || type !== 'access')
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    
    const user = await this.userService.getById(userId);
  
    if (user === null) throw new UnauthorizedException('User not found');
    
    return user;
  }
}
