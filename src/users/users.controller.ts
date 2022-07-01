import {
  Body,
  Controller,
  Get,
  Logger,
  NotFoundException,
  Param,
  Post, Req,
  UseGuards,
  UseInterceptors,
  UploadedFile
} from '@nestjs/common';

import { S3 } from 'aws-sdk';

import { v4 as uuid } from 'uuid'

import {
  FileInterceptor
} from '@nestjs/platform-express';

const jwt = require('jsonwebtoken');

import { AuthGuard } from '@nestjs/passport';
import { CreateUserBody } from './dto/requests';
import { LoginResponseDto, UserResponseDto, UploadedAvatarDto } from './dto/responses';
import { UsersService } from './users.service';
import { Request } from 'express';
import config from '../config';
import { getToken } from '../util';

/**
 * users controller
 */
@Controller('/users')
export class UsersController {
  /** logger */
  private readonly logger = new Logger(UsersController.name);
  /**
   * UsersController
   * @param {UsersService} usersService - inject
   */
  constructor(private readonly usersService: UsersService) {}
  
  @Post('/create')
  async createUser(
    @Body() data: CreateUserBody,
  ): Promise<LoginResponseDto> {
    const createdUser = await this.usersService.create(data);
    
    const status = 'pending';
    
    return new LoginResponseDto(status, createdUser);
  }
  
  @UseGuards(AuthGuard('jwt'))
  @Post('/upload_avatar')
  @UseInterceptors(FileInterceptor('image'))
  async uploadFile(@Req() request: Request, @UploadedFile() image: Express.Multer.File): Promise<UploadedAvatarDto> {
    const token = getToken(request);
    const payload = jwt.verify(token, config.jwtSecret);
    
    const file = await this.usersService.uploadAvatar({buffer: image.buffer, name: image.originalname, userId: payload.userId});
    
    return {
      key: file.key,
      url: file.url
    }
  }
  
  @UseGuards(AuthGuard('jwt'))
  @Post('/options')
  async setUserOptions(@Req() request: Request, @Body() options: {volume: number, language: string}): Promise<boolean> {
    const token = getToken(request);
    const payload = jwt.verify(token, config.jwtSecret);
    
    // console.log(payload);
    
    const user = await this.usersService.getById(payload.userId);
    if (user === undefined) {
      throw new NotFoundException('user not found');
    }
    
    await this.usersService.update(user.id, {options});
    
    return true;
  }
  
  
  @UseGuards(AuthGuard('user_jwt'))
  @Get('/self')
  async findCurrent(@Req() request: Request): Promise<UserResponseDto> {
    const token = getToken(request);
    const payload = jwt.verify(token, config.jwtSecret);
    
    const user = await this.usersService.getById(payload.userId);
    if (user === undefined) {
      throw new NotFoundException('user not found');
    }
    
    return new UserResponseDto(user);
  }

  /**
   * / getById endpoint handler
   * @param {string} id - user id
   * @returns {Promise<UserResponseDto>} - user data
   */
  @UseGuards(AuthGuard('jwt'))
  @Get('/:id')
  async findOne(@Param('id') id: string): Promise<UserResponseDto> {
    const user = await this.usersService.getById(id);
    if (user === undefined) {
      throw new NotFoundException('user not found');
    }

    return new UserResponseDto(user);
  }
}
