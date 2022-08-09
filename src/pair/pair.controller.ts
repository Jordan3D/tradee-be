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

import {getUnixTime} from 'date-fns';


const jwt = require('jsonwebtoken');

import { AuthGuard } from '@nestjs/passport';
import { CreateBody, UpdateBody } from './dto/requests';
import { ResponseDto } from './dto/responses';
import { Request } from 'express';
import config from '../config';
import { getToken } from '../util';
import { IPair } from 'src/interfaces/pair.interface';
import { PairService } from './pair.service';


@Controller('/pair')
export class PairController {

  private readonly logger = new Logger(PairController.name);
  constructor(private readonly rootService: PairService) { }

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

  // for input search
  @UseGuards(AuthGuard('jwt'))
  @Get('/list')
  async findAll():Promise<IPair[]> {
    return this.rootService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/:id')
  async findOne(@Param('id') id: string): Promise<ResponseDto> {
    const entity = await this.rootService.getById(id);
    if (entity === undefined) {
      throw new NotFoundException('Pair not found');
    }

    return new ResponseDto(entity);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('/:id')
  async delete(@Param('id') id: string, @Req() request: Request): Promise<boolean> {
    const token = getToken(request);

    const entity = await this.rootService.getById(id);
    if (entity === undefined) {
      throw new NotFoundException('Pair not found');
    }


    return this.rootService.delete(id)
  }
}
