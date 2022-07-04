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
