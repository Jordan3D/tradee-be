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
import { NoteService } from './note.service';
import { Request } from 'express';
import config from '../config';
import { getToken } from '../util';
import { TagEntity } from 'src/model';
import { ICommentFull } from 'src/interfaces/comment.interface';
import { INoteFull } from 'src/interfaces/note.interface';

/**
 * users controller
 */
@Controller('/note')
export class NoteController {

  private readonly logger = new Logger(NoteController.name);
  constructor(private readonly rootService: NoteService) { }

  @Post('/create')
  async create(
    @Body() data: CreateBody,
    @Req() request: Request
  ): Promise<ResponseDto> {
    let createdEntity;

    try {
      const createData = { ...data, author: '' };
      const token = getToken(request);
      const payload = jwt.verify(token, config.jwtSecret);

      createData.author = payload.userId;

      createdEntity = await this.rootService.create(createData);
    } catch (e) {
      console.log(e);
      throw new BadRequestException('Something was wrong');
    }

    return new ResponseDto(createdEntity);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/:id')
  async findOne(@Param('id') id: string): Promise<ResponseDto> {
    const entity = await this.rootService.getById(id);
    if (entity === undefined) {
      throw new NotFoundException('Tag not found');
    }

    return new ResponseDto(entity);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/:id')
  async update(@Param('id') id: string, @Body() data: UpdateBody, @Req() request: Request): Promise<ResponseDto> {
    const token = getToken(request);
    const payload = jwt.verify(token, config.jwtSecret);

    const entity = await this.rootService.getById(id);
    if (entity === undefined) {
      throw new NotFoundException('Entity not found');
    }

    // TODO: check owner by jwt
    if (payload.userId !== entity.author.id) {
      throw new UnauthorizedException('Not allowed to change');
    }

    let updatedEntity;

    try {
      updatedEntity = await this.rootService.update(id, data);
    } catch (e) {
      throw new BadRequestException('Something was wrong');
    }

    return new ResponseDto(updatedEntity);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('/:id')
  async delete(@Param('id') id: string, @Req() request: Request): Promise<boolean> {
    const token = getToken(request);
    const payload = jwt.verify(token, config.jwtSecret);

    const entity = await this.rootService.getById(id);
    if (entity === undefined) {
      throw new NotFoundException('Entity not found');
    }

    // TODO: check author by jwt
    if (payload.userId !== entity.author.id) {
      throw new UnauthorizedException('Not allowed to delete');
    }


    return this.rootService.delete(id)
  }
}
