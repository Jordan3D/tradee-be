import {
  Body,
  Controller,
  Get,
  Logger,
  NotFoundException,
  Param,
  Post, Req,
  UseGuards,
} from '@nestjs/common';

const jwt = require('jsonwebtoken');

import { AuthGuard } from '@nestjs/passport';
import { CreateUserBody } from './dto/requests';
import { UserResponseDto } from './dto/responses';
import { UsersService } from './user.service';
import { Request } from 'express';
import config from '../config';
import { getToken } from '../util';

/**
 * users controller
 */
@Controller('/user')
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
  ): Promise<UserResponseDto> {
    const createdUser = await this.usersService.create(data);
    
    return new UserResponseDto(createdUser);
  }
  
  
  @UseGuards(AuthGuard('jwt'))
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

  @UseGuards(AuthGuard('jwt'))
  @Get('/:id')
  async findOne(@Param('id') id: string): Promise<UserResponseDto> {
    const user = await this.usersService.getById(id);
    if (user === undefined) {
      throw new NotFoundException('User not found');
    }

    return new UserResponseDto(user);
  }
}
