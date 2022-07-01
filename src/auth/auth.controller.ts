import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { plainToClass } from 'class-transformer';
import { ClassType } from 'class-transformer/ClassTransformer';
import { validate } from 'class-validator';
import { AuthService } from './auth.service';
import { RefreshTokenDto } from './dto/refreshToken.dto';
import { RefreshTokenResponseDto } from './dto/refreshTokenResponse.dto';
import { SignInDto } from './dto/signin.dto';
import { UserLoginResponseDto } from './dto/user/userLogin.Response.dto';
import { AdminLoginResponseDto } from './dto/admin/adminLogin.Response.dto';
/**
 * auth controller
 */
@Controller('/auth')
export class AuthController {
  /**
   * @param {AuthService} authService - auth service
   */
  constructor(
    private readonly authService: AuthService
  ) {}

  /**
   * /refresh endpoint handler
   * @param {RefreshTokenDto} refreshToken - refreshToken
   * @returns {Promise<RefreshTokenResponseDto>} - refreshed tokens
   */
  @Post('/refresh')
  async refresh(
    @Body() { refresh_token }: RefreshTokenDto,
  ): Promise<RefreshTokenResponseDto> {
    const updatedTokens = await this.authService.refreshToken(refresh_token);

    return new RefreshTokenResponseDto(
      updatedTokens.access_token,
      updatedTokens.refresh_token,
    );
  }

  /**
   * /signup  student, teachers endpoint handler
   * @param {SignInUserDto}  -  telephone and code,
   * @returns {Promise<UserLoginResponseDto>} - user, tokens, expireIn
   */
  @Post('/signin') async signin(@Body() {email, password, secret}: SignInDto): Promise<UserLoginResponseDto | AdminLoginResponseDto> {
    if(secret !== undefined){
      if(secret !== process.env.SECRET){
        throw new BadRequestException();
      } else {
        const admin = await this.authService.validateAdmin(email, password);
  
        const result = await this.authService.signin(admin, 'admin');
  
        return new AdminLoginResponseDto(
          admin,
          result.access_token,
          result.refresh_token,
          result.expiresIn,
        );
      }
      
    } else {
      const user = await this.authService.validateUser(email, password);
      
      const result = await this.authService.signin(user, 'user');
  
      return new UserLoginResponseDto(
        user,
        result.access_token,
        result.refresh_token,
        result.expiresIn,
      );
    }
  }
  /**
   * / delete token endpoint handler
   * @param {string} id - user data
   * @returns {Promise<RefreshTokenResponseDto>} - deleted user
   */
  @UseGuards(AuthGuard('jwt'))
  @Delete('/delete/:id')
  async deleteUser(@Param('id') id: string): Promise<boolean> {
    return this.authService.deleteToken(id);
  }

  private async validate<T>(cls: ClassType<T>, plain: unknown): Promise<T> {
    if (typeof plain !== 'object' || plain === null)
      throw new BadRequestException();

    const transformed = plainToClass(cls, plain);

    const errors = await validate(transformed);

    if (errors.length !== 0) throw new BadRequestException();

    return transformed;
  }
}
