import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  MethodNotAllowedException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as uuid from 'uuid';
import config from '../config/index';
import { AuthData } from '../interfaces/auth-data.interface';
import { UsersService } from '../users';
import { AdminEntity, TokenEntity, UserEntity } from '../model';
import { DbTokenDto } from './dto/dbToken.dto';
import { RefreshTokenResponseDto } from './dto/refreshTokenResponse.dto';
import { AdminService } from '../admin';

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
    @InjectRepository(TokenEntity) private readonly tokenRepo:  Repository<TokenEntity>,
    private readonly usersService: UsersService,
    private readonly adminService: AdminService
  ) {}
  
  async validateUser(email: string, password: string): Promise<UserEntity> {
    const user = await this.usersService.getByEmail(email);
    
    if (!user || user.isDeleted === true || !await bcrypt.compare(password, user.password)) {
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    } else {
      return user;
    }
  }
  
  async validateAdmin(email: string, password: string): Promise<AdminEntity> {
    const admin = await this.adminService.getByEmail(email);
    if (!admin || admin.isDeleted === true || !await bcrypt.compare(password, admin.password)) {
      throw new HttpException('admin not found', HttpStatus.NOT_FOUND);
    } else {
      return admin;
    }
  }
  
  async signin(auth: AuthData, role: 'admin' | 'user'):
    Promise<{ auth: AuthData; access_token: string; refresh_token: string; expiresIn: number; }> {
    const userId = auth.id;
  
    const user = role === 'admin' ? await this.adminService.getById(userId) :
      role === 'user' ? await this.usersService.getById(userId) : undefined;
    
    if (!user || user.isDeleted) {
      throw new ForbiddenException('Entity profile is deleted.');
    }
    
    const access_token = await this.generateAccessToken(userId, role);
    const { id: refreshTokenId, token: refresh_token } = await this.generateRefreshToken(role);
    
    const res = await this.tokenRepo.create({ tokenId: refreshTokenId, userId });
    await this.tokenRepo.save(res);
    
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
  async generateAccessToken(userId: string, role: 'user' | 'admin'): Promise<string> {
    const token = jwt.sign(
      {
        userId,
        type: config.jwt.tokens.access.type,
        role
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
  async generateRefreshToken(role: 'user' | 'admin') {
    const payload = {
      id: uuid.v4(),
      type: config.jwt.tokens.refresh.type,
      role
    };
    const token = jwt.sign(
      {
        userId: payload.id,
        type: payload.type,
        role: payload.role
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
   * @param {string} tokenId- tocken id
   * @param {string} userId- userId
   * @returns {DbTokenDto} - replaced refreshTocken
   */
  async replaceDbRefreshToken(tokenId, userId): Promise<DbTokenDto> {
    const token = await this.tokenRepo.findOne({ userId });
    if (!token) {
      throw new NotFoundException('Token is not found');
    } else {
      
      await this.tokenRepo.delete({ userId });
      try {
        const newToken: DbTokenDto = await this.tokenRepo.create({
          tokenId,
          userId: userId,
        });
  
        await this.tokenRepo.save(newToken);
        
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
  async updateTokens(userId: string, role: 'user'|'admin'): Promise<RefreshTokenResponseDto> {
    const accessToken = await this.generateAccessToken(userId, role);
    const refreshToken = await this.generateRefreshToken(role);
    
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
        const token = await this.tokenRepo.findOne({ tokenId: payload.userId });
        if (!token) {
          throw new HttpException('token was not found', HttpStatus.NOT_FOUND);
        }
        
        const updatedTokens = await this.updateTokens(token.userId, payload.role);
        
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
    const one = await this.tokenRepo.findOne(id);
    const res = await this.tokenRepo.delete(id);
  
    return res.raw.id === id
  }
  
}
