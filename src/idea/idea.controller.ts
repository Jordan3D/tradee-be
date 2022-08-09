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
import { IdeaService } from './idea.service';
import { Request } from 'express';
import config from '../config';
import { getToken } from '../util';
import { IIdea } from 'src/interfaces/idea.interface';

/**
 * users controller
 */
@Controller('/idea')
export class IdeaController {

  private readonly logger = new Logger(IdeaController.name);
  constructor(private readonly rootService: IdeaService) { }

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

      console.log(createData);

      createdEntity = await this.rootService.create(createData);
    } catch (e) {
      throw new BadRequestException(e);
    }

    return new ResponseDto(createdEntity);
  }

  // for calendar search
  @UseGuards(AuthGuard('jwt'))
  @Get('/dateMap')
  async findByDate(@Req() request: Request, @Query() query):Promise<Record<string,IIdea>> {
    const token = getToken(request);
    const payload = jwt.verify(token, config.jwtSecret);
    const {startDate, endDate} = query;
    const data = await this.rootService.findByDate({startDate, endDate, authorId: payload.userId});
    let result = {};

    data.forEach(idea => {
      const date = getUnixTime(idea.createdAt);
      result[date] = result[date] ? result[date].push(idea) : [];
    })

    return result;
  }

  // for input search
  @UseGuards(AuthGuard('jwt'))
  @Get('/list')
  async findByText(@Req() request: Request, @Query() query):Promise<IIdea[]> {
    const token = getToken(request);
    const payload = jwt.verify(token, config.jwtSecret);
    const {text, limit, lastId} = query;
    return this.rootService.findBy({text, limit, lastId, authorId: payload.userId})
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/:id')
  async findOne(@Param('id') id: string): Promise<ResponseDto> {
    const entity = await this.rootService.getById(id);
    if (entity === undefined) {
      throw new NotFoundException('Idea not found');
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
      throw new NotFoundException('Note not found');
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
      throw new NotFoundException('Idea not found');
    }

    // TODO: check author by jwt
    if (payload.userId !== entity.authorId) {
      throw new UnauthorizedException('Not allowed to delete');
    }


    return this.rootService.delete(id)
  }
}
