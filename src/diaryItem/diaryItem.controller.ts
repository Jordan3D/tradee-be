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
  Query,
  Delete
} from '@nestjs/common';


const jwt = require('jsonwebtoken');

import { AuthGuard } from '@nestjs/passport';
import { CreateBody, UpdateBody } from './dto/requests';
import { ResponseDto } from './dto/responses';
import { DiaryItemService } from './diaryItem.service';
import { Request } from 'express';
import config from '../config';
import { getToken } from '../util';
import { IDiaryItemFull, IDiaryItemOverall } from 'src/interfaces/diaryItem.interface';


@Controller('/diary-item')
export class DiaryItemController {

  private readonly logger = new Logger(DiaryItemController.name);
  constructor(private readonly rootService: DiaryItemService) { }

  @Post('/create')
  async create(
    @Body() data: CreateBody,
    @Req() request: Request
  ): Promise<ResponseDto> {
    let createdEntity;
    
    try {
      const createData = { ...data, authorId: '' };
      const token = getToken(request);
      const payload = jwt.verify(token, config.jwtSecret);

      createData.authorId = payload.userId;

      createdEntity = await this.rootService.create(createData);
    } catch (e) {
      throw new BadRequestException(e);
    }

    return new ResponseDto(createdEntity);
  }

  // for calendar search
  @UseGuards(AuthGuard('jwt'))
  @Get('/list')
  async findByDate(@Req() request: Request, @Query() query):Promise<IDiaryItemFull[]> {
    const token = getToken(request);
    const payload = jwt.verify(token, config.jwtSecret);
    const {startDate, endDate} = query;
    return this.rootService.findByDate({startDate, endDate, authorId: payload.userId});
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/:id')
  async findOne(@Param('id') id: string): Promise<IDiaryItemOverall> {
    const entity = await this.rootService.findById({id});
    if (entity === undefined) {
      throw new NotFoundException('Item not found');
    }

    return entity;
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/:id')
  async update(@Param('id') id: string, @Body() data: UpdateBody, @Req() request: Request): Promise<ResponseDto> {
    const token = getToken(request);
    const payload = jwt.verify(token, config.jwtSecret);

    const entity = await this.rootService.getById(id);
    if (entity === undefined) {
      throw new NotFoundException('Item not found');
    }

    // TODO: check owner by jwt
    if (payload.userId !== entity.authorId) {
      throw new UnauthorizedException('Not allowed to change');
    }

    let updatedEntity;

    try {
      updatedEntity = await this.rootService.update(id, data);
    } catch (e) {
      throw new BadRequestException(e);
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
      throw new NotFoundException('Note not found');
    }

    // TODO: check author by jwt
    if (payload.userId !== entity.authorId) {
      throw new UnauthorizedException('Not allowed to delete');
    }


    return this.rootService.delete(id)
  }
}
