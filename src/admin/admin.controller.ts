import {
  Body,
  Controller,
  Get,
  Logger,
  NotFoundException,
  BadRequestException,
  Param,
  Post, Req,
  UseGuards,
} from '@nestjs/common';

const jwt = require('jsonwebtoken');

import { AuthGuard } from '@nestjs/passport';
import { CreateAdminBody } from './dto/requests';
import { LoginResponseDto, AdminResponseDto } from './dto/responses';
import { AdminService } from './admin.service';
import { Request } from 'express';
import config from '../config';
import { getToken } from '../util';

/**
 * users controller
 */
@Controller('/admin')
export class AdminController {
  /** logger */
  private readonly logger = new Logger(AdminController.name);
  /**
   * UsersController
   * @param {AdminService} usersService - inject
   */
  constructor(private readonly adminService: AdminService) {}
  
  @Post('/create')
  async createAdmin(
    @Body() data: CreateAdminBody,
  ): Promise<LoginResponseDto> {
    // secret check
    if(process.env.SECRET !== data.secret){
      throw new BadRequestException('admin not found');
    }
    
    const createdAdmin = await this.adminService.create(data);
    this.logger.log(`signup ${data.email}`);
    
    const status = 'pending';
    
    return new LoginResponseDto(status, createdAdmin);
  }
  
  @UseGuards(AuthGuard('admin_jwt'))
  @Get('/self')
  async findCurrent(@Req() request: Request): Promise<AdminResponseDto> {
    
    const token = getToken(request);
    const payload = jwt.verify(token, config.jwtSecret);
    
    const user = await this.adminService.getById(payload.userId);
    if (user === undefined) {
      throw new NotFoundException('admin not found');
    }
    
    return new AdminResponseDto(user);
  }

  /**
   * / getById endpoint handler
   * @param {string} id - user id
   * @returns {Promise<UserResponseDto>} - user data
   */
  @UseGuards(AuthGuard('admin_jwt'))
  @Get('/:id')
  async findOne(@Param('id') id: string): Promise<AdminResponseDto> {
    const user = await this.adminService.getById(id);
    if (user === undefined) {
      throw new NotFoundException('admin not found');
    }

    return new AdminResponseDto(user);
  }
}
