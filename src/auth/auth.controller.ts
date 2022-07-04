import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Param,
  Post,
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
   * /signup
   * @param {SignInUserDto}  -  telephone and code,
   * @returns {Promise<UserLoginResponseDto>} - user, tokens, expireIn
   */
  @Post('/signin') async signin(@Body() {identityString, password, secret}: SignInDto): Promise<UserLoginResponseDto> {

    if(secret !== undefined && secret !== process.env.SECRET){
      throw new BadRequestException();
    }
    
    const user = await this.authService.validateUser(identityString, password);
    
    const result = await this.authService.signin(user);

    return new UserLoginResponseDto(
      user,
      result.access_token,
      result.refresh_token,
      result.expiresIn,
    );
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
