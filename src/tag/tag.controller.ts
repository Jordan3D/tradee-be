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
import { ResponseDto } from './dto/responses';
import { TagService } from './tag.service';
import { Request } from 'express';
import config from '../config';
import { getToken } from '../util';
import { TagEntity } from 'src/model';

@Controller('/tag')
export class TagController {

  private readonly logger = new Logger(TagController.name);
  constructor(private readonly tagService: TagService) {}
  
  @Post('/create')
  async create(
    @Body() data: CreateBody,
    @Req() request: Request
  ): Promise<ResponseDto> {
    let created : TagEntity; 
    const createData = {...data, author : ''};

    const token = getToken(request);
    const payload = jwt.verify(token, config.jwtSecret);
    createData.author = payload.userId;
    createData.parent = payload.parent ?? null;

    try {
      created = await this.tagService.create(createData);
    } catch(e) {
      throw new BadRequestException('Something was wrong');
    }
    
    return new ResponseDto(created);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/list')
  async findAllByUser( @Req() request: Request): Promise<ResponseDto[]>{
    const token = getToken(request);
    const payload = jwt.verify(token, config.jwtSecret);
    payload.userId;
    
    return this.tagService.getAllByAuthor(payload.userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/:id')
  async findOne(@Param('id') id: string): Promise<ResponseDto> {
    const tag = await this.tagService.getById(id);
    if (tag === undefined) {
      throw new NotFoundException('Tag not found');
    }

    return new ResponseDto(tag);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/:id')
  async update(@Param('id') id: string, @Body() data: UpdateBody, @Req() request: Request): Promise<ResponseDto> {
    const token = getToken(request);
    const payload = jwt.verify(token, config.jwtSecret);
    
    const tag = await this.tagService.getById(id);
    if (tag === undefined) {
      throw new NotFoundException('Tag not found');
    }

    if(payload.userId !== tag.author.id){
      throw new UnauthorizedException('Not allowed to change');
    }

    let updatedTag; 

    try {
      updatedTag = await this.tagService.update(id, data);
    } catch(e) {
      throw new BadRequestException('Something was wrong');
    }
    
    return new ResponseDto(updatedTag);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('/:id')
  async delete(@Param('id') id: string, @Req() request: Request): Promise<TagEntity> {
    const token = getToken(request);
    const payload = jwt.verify(token, config.jwtSecret);

    const tag = await this.tagService.getById(id);
    if (tag === undefined) {
      throw new NotFoundException('Tag not found');
    }

    if(payload.userId !== tag.author.id){
      throw new UnauthorizedException('Not allowed to delete');
    }


    return this.tagService.delete(id)
  }
}
