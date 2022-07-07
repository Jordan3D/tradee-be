import {
  Body,
  Controller,
  Get,
  Logger,
  NotFoundException,
  Param,
  Post,
  BadRequestException,
  UnauthorizedException,
  UseGuards,
  Req,
  Delete
} from '@nestjs/common';


const jwt = require('jsonwebtoken');

import { AuthGuard } from '@nestjs/passport';
import { CreateBody, UpdateBody } from './dto/requests';
import { TagResponseDto } from './dto/responses';
import { TagService } from './tag.service';
import { Request } from 'express';
import config from '../config';
import { getToken } from '../util';
import { TagEntity } from 'src/model';

/**
 * users controller
 */
@Controller('/tag')
export class TagController {

  private readonly logger = new Logger(TagController.name);
  constructor(private readonly tagService: TagService) {}
  
  @Post('/create')
  async createUser(
    @Body() data: CreateBody,
    @Req() request: Request
  ): Promise<TagResponseDto> {
    let createdTag; 
    const createData = {...data, owner : ''};

    const token = getToken(request);
    const payload = jwt.verify(token, config.jwtSecret);
    createData.owner = payload.userId;

    try {
      createdTag = await this.tagService.create(createData);
    } catch(e) {
      throw new BadRequestException('Something was wrong');
    }
    
    return new TagResponseDto(createdTag);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/:id')
  async findOne(@Param('id') id: string): Promise<TagResponseDto> {
    const tag = await this.tagService.getById(id);
    if (tag === undefined) {
      throw new NotFoundException('Tag not found');
    }

    return new TagResponseDto(tag);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/:id')
  async update(@Param('id') id: string, @Body() data: UpdateBody, @Req() request: Request): Promise<TagResponseDto> {
    const token = getToken(request);
    const payload = jwt.verify(token, config.jwtSecret);
    
    const tag = await this.tagService.getById(id);
    if (tag === undefined) {
      throw new NotFoundException('Tag not found');
    }

    // TODO: check owner by jwt
    if(payload.userId !== tag.owner.id){
      throw new UnauthorizedException('Not allowed to change');
    }

    let updatedTag; 

    try {
      updatedTag = await this.tagService.update(id, data);
    } catch(e) {
      throw new BadRequestException('Something was wrong');
    }
    
    return new TagResponseDto(updatedTag);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('/:id')
  async delete(@Param('id') id: string, @Req() request: Request): Promise<TagEntity> {
    const token = getToken(request);
    const payload = jwt.verify(token, config.jwtSecret);

    console.log(id);

    const tag = await this.tagService.getById(id);
    if (tag === undefined) {
      throw new NotFoundException('Tag not found');
    }

    console.log(2);

    // TODO: check owner by jwt
    if(payload.userId !== tag.owner.id){
      throw new UnauthorizedException('Not allowed to delete');
    }


    return this.tagService.delete(id)
  }
}
