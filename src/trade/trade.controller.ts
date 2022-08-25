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
import { ITrade, ITradeOverall } from 'src/interfaces/trade.interface';
import { TradeService } from './trade.service';
import { TradeEntity } from './trade.entity';


@Controller('/trade')
export class TradeController {

  private readonly logger = new Logger(TradeController.name);
  constructor(private readonly rootService: TradeService) { }

  @Post('/create')
  async create(
    @Body() data: CreateBody,
    @Req() request: Request
  ): Promise<ResponseDto> {
    let createdEntity;
    
    try {
      const createData = { ...data, authorId: '', isManual: true };
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
  @Get('/dateMap')
  async findByDate(@Req() request: Request, @Query() query):Promise<Record<string,ITrade>> {
    const token = getToken(request);
    const payload = jwt.verify(token, config.jwtSecret);
    const {startDate, endDate} = query;
    const data = await this.rootService.findByDate({startDate, endDate, authorId: payload.userId});
    let result = {};

    data.forEach(note => {
      const date = getUnixTime(note.createdAt);
      result[date] = result[date] ? result[date].push(note) : [];
    })

    return result;
  }

  // for input search
  @UseGuards(AuthGuard('jwt'))
  @Post('/get-ids')
  async findByIds(@Req() request: Request, @Body() data: string[]):Promise<ITradeOverall[]> {
    const token = getToken(request);
    const payload = jwt.verify(token, config.jwtSecret);

    return this.rootService.findByIds({authorId: payload.userId, Ids: data})
  }

   // for input search
   @UseGuards(AuthGuard('jwt'))
   @Get('/list')
   async findBy(@Req() request: Request, @Query() query):Promise<Readonly<{
     data: ITradeOverall[], total: number, offset: number, limit: number
   }>> {
     const token = getToken(request);
     const payload = jwt.verify(token, config.jwtSecret);
 
     try {
       const [_orderBy] = query.orderBy ? query.orderBy?.split(',') : [];
 
       if(_orderBy && !Object.keys(TradeEntity.getAttributes()).includes(_orderBy)){
         throw new Error('Wrong order params')
       }
     }catch(e){
       throw new BadRequestException(e.message)
     }
 
     return this.rootService.findBy({...query, authorId: payload.userId})
   }

  @UseGuards(AuthGuard('jwt'))
  @Get('/:id')
  async findOne(@Param('id') id: string): Promise<ResponseDto> {
    const entity = await this.rootService.getById(id);
    if (entity === undefined) {
      throw new NotFoundException('Trade not found');
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
      throw new NotFoundException('Trade not found');
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
      throw new NotFoundException('Trade not found');
    }

    // TODO: check author by jwt
    if (payload.userId !== entity.authorId) {
      throw new UnauthorizedException('Not allowed to delete');
    }


    return this.rootService.delete(id)
  }
}
