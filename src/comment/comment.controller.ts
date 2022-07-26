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
import { CommentService } from './comment.service';
import { Request } from 'express';
import config from '../config';
import { getToken } from '../util';
import { TagEntity } from 'src/models';
import { ICommentFull } from 'src/interfaces/comment.interface';

/**
 * users controller
 */
@Controller('/comment')
export class CommentController {

  private readonly logger = new Logger(CommentController.name);
  constructor(private readonly commentService: CommentService) { }

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

      createdEntity = await this.commentService.create(createData);
    } catch (e) {
      throw new BadRequestException('Something was wrong');
    }

    return new ResponseDto(createdEntity);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/:id')
  async findOne(@Param('id') id: string): Promise<ResponseDto> {
    const tag = await this.commentService.getById(id);
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

    const entity = await this.commentService.getById(id);
    if (entity === undefined) {
      throw new NotFoundException('Entity not found');
    }

    // TODO: check owner by jwt
    if (payload.userId !== entity.author.id) {
      throw new UnauthorizedException('Not allowed to change');
    }

    let updatedEntity;

    try {
      updatedEntity = await this.commentService.update(id, data);
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

    const entity = await this.commentService.getById(id);
    if (entity === undefined) {
      throw new NotFoundException('Entity not found');
    }

    // TODO: check author by jwt
    if (payload.userId !== entity.author.id) {
      throw new UnauthorizedException('Not allowed to delete');
    }


    return this.commentService.remove(id)
  }
}
