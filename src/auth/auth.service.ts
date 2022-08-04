import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  MethodNotAllowedException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as uuid from 'uuid';
import {validate} from 'isemail';
import config from '../config/index';
import { AuthData } from '../interfaces/auth-data.interface';
import { UsersService } from '../user';
import { TokenEntity, UserEntity } from 'src/models';
import { DbTokenDto } from './dto/dbToken.dto';
import { RefreshTokenResponseDto } from './dto/refreshTokenResponse.dto';

const bcrypt = require('bcrypt');

/** lodash */
const _ = require('lodash');
const jwt = require('jsonwebtoken');

/** authentication service */
@Injectable()
export class AuthService {
  /**
   * UsersService
   * @param {UsersService} usersService - inject
   */
  constructor(
    @InjectModel(TokenEntity) private readonly tokenModel: typeof TokenEntity,
    private readonly usersService: UsersService
  ) {}
  
  async validateUser(identityString: string, password: string): Promise<UserEntity> {

    let user: UserEntity | undefined;
    // if "identityString" is Email
    if(validate(identityString)){
      user = await this.usersService.getByEmail(identityString);
    } else {
      user = await this.usersService.getByUsername(identityString);
    }

    if (!user || !await bcrypt.compare(password, user.password)) {
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    } else {
      return user;
    }
  }
  
  async signin(auth: AuthData):
    Promise<{ auth: AuthData; access_token: string; refresh_token: string; expiresIn: number; }> {
    const userId = auth.id;
  
    const user = await this.usersService.getById(userId);
    
    if (!user) {
      throw new ForbiddenException('Entity profile is deleted.');
    }
    
    const access_token = await this.generateAccessToken(userId);
    const { id: refreshTokenId, token: refresh_token } = await this.generateRefreshToken(userId);
    
    await this.tokenModel.create({ tokenId: refreshTokenId, userId });
    
    return {
      auth,
      access_token,
      refresh_token,
      expiresIn: config.jwt.tokens.refresh.expiresIn,
    };
  }
  
  /**
   *  generateAccessToken
   *  @param {string} userId - userId
   * @returns {string} - accessTocken
   */
  async generateAccessToken(userId: string): Promise<string> {
    const token = jwt.sign(
      {
        userId,
        type: config.jwt.tokens.access.type
      },
      config.jwtSecret,
      { expiresIn: config.jwt.tokens.access.expiresIn },
    );
    return token;
  }
  
  /**
   *  generateRefreshToken
   * @returns {id: string, token: string} - refreshtoken and id
   */
  async generateRefreshToken(userId: string) {
    const payload = {
      id: uuid.v4(),
      type: config.jwt.tokens.refresh.type
    };
    const token = jwt.sign(
      {
        userId,
        type: payload.type
      },
      config.jwtSecret,
      { expiresIn: config.jwt.tokens.refresh.expiresIn },
    );
    return {
      id: payload.id,
      token,
    };
  }
  /**
   *  replaceDbRefreshToken
   * @param {string} tokenId- token id
   * @param {string} userId- userId
   * @returns {DbTokenDto} - replaced refreshTocken
   */
  async replaceDbRefreshToken(tokenId, userId): Promise<DbTokenDto> {
    const token = await this.tokenModel.findOne({where: {userId}});
    if (!token) {
      throw new NotFoundException('Token is not found');
    } else {
      
      await this.tokenModel.destroy({where: { userId }});
      try {
        const newToken: DbTokenDto = await this.tokenModel.create({
          tokenId,
          userId: userId,
        });
        
        return newToken;
      } catch (e) {
        throw new NotFoundException(e.message);
      }
    }
  }
  
  /**
   *   updateTokens
   * @param {string} userId- userId
   * @returns {RefreshTokenResponseDto} - updated tokens
   */
  async updateTokens(userId: string ): Promise<RefreshTokenResponseDto> {
    const accessToken = await this.generateAccessToken(userId);
    const refreshToken = await this.generateRefreshToken(userId);
    
    await this.replaceDbRefreshToken(refreshToken.id, userId);
    
    return {
      access_token: accessToken,
      refresh_token: refreshToken.token,
    };
  }
  
  /**
   *  refreshToken
   * @param {string} refreshtoken- refreshtoken
   * @returns {string} -updated refresh and access tokens
   */
  async refreshToken(refreshToken: string) {
    let payload;
    try {
      payload = jwt.verify(refreshToken, config.jwtSecret);
      if (payload.type !== 'refresh') {
        throw new NotFoundException('type is not access');
      } else {
        const token = await this.tokenModel.findOne({where: {userId: payload.userId}, raw: true});
        if (!token) {
          throw new HttpException('token was not found', HttpStatus.NOT_FOUND);
        }
        
        const updatedTokens = await this.updateTokens(token.userId);
        
        return { ...updatedTokens, userId: token.userId };
      }
    } catch (e) {
      if (e instanceof jwt.TokenExpiredError) {
        throw new NotFoundException('token.expired');
      } else if (e instanceof jwt.JsonWebTokenError) {
        throw new NotFoundException('token.error');
      } else {
        throw new NotFoundException('server-error');
      }
    }
  }
  
  /**
   * deleteById func
   * @param {string} id - user id
   * @returns {Promise<boolean>} - token
   */
  async deleteToken(id: string): Promise<boolean> {
    const res = await this.tokenModel.destroy({where: {id}});
  
    return !!res
  }
  
}
