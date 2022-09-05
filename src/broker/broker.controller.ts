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
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
  InternalServerErrorException
} from '@nestjs/common';


const jwt = require('jsonwebtoken');

import { AuthGuard } from '@nestjs/passport';
import { CreateBody, SyncBody, UpdateBody } from './dto/requests';
import { ResponseBroker } from './dto/responses';
import { Request } from 'express';
import config from '../config';
import { getToken } from '../util';
import { ITrade } from 'src/interfaces/trade.interface';
import { BrokerService } from './broker.service';
import { BrokerTypeEnum, IBroker } from 'src/interfaces/broker.interface';


@Controller('/broker')
export class BrokerController {

  private readonly logger = new Logger(BrokerController.name);
  constructor(private readonly rootService: BrokerService) { }

  @Post('/create')
  async create(
    @Body() data: CreateBody,
    @Req() request: Request
  ): Promise<ResponseBroker> {
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

    return new ResponseBroker(createdEntity);
  }

  // for input search
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/list')
  async findBy(@Req() request: Request):Promise<ResponseBroker[]> {
    const token = getToken(request);
    const payload = jwt.verify(token, config.jwtSecret);
    return (await this.rootService.list(payload.userId)).map( b => new ResponseBroker(b))
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/sync')
  async sync(@Body() data: SyncBody, @Req() request: Request): Promise<boolean>{
    const token = getToken(request);
    const payload = jwt.verify(token, config.jwtSecret);
    
    const {broker} = data;

    try{
      await this.rootService.sync(broker, payload.userId);
    }catch(e){
      console.log(e)
    }  

    return true;
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/sync-clear')
  async clearSync(@Body() data: SyncBody, @Req() request: Request): Promise<boolean>{
    const token = getToken(request);
    const payload = jwt.verify(token, config.jwtSecret);
    
    const {broker} = data;

    try{
      return this.rootService.clearSync(broker, payload.userId);
    }catch(e){
      throw new InternalServerErrorException(e.message);
    }  

    return false;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/broker-types')
  async brokerTypes(): Promise<string[]> {
    return Object.keys(BrokerTypeEnum);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/:id')
  async findOne(@Param('id') id: string): Promise<ResponseBroker> {
    const entity = await this.rootService.getById(id);
    if (entity === undefined) {
      throw new NotFoundException('Broker not found');
    }

    return new ResponseBroker(entity);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/:id')
  async update(@Param('id') id: string, @Body() data: UpdateBody, @Req() request: Request): Promise<ResponseBroker> {
    const token = getToken(request);
    const payload = jwt.verify(token, config.jwtSecret);

    const entity = await this.rootService.getById(id);
    if (entity === undefined) {
      throw new NotFoundException('Broker not found');
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

    return new ResponseBroker(updatedEntity);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('/:id/remove')
  async remove(@Param('id') id: string, @Req() request: Request): Promise<boolean> {
    const token = getToken(request);
    const payload = jwt.verify(token, config.jwtSecret);

    const entity = await this.rootService.getById(id);
    if (entity === undefined) {
      throw new NotFoundException('Broker not found');
    }

    // TODO: check author by jwt
    if (payload.userId !== entity.authorId) {
      throw new UnauthorizedException('Not allowed to delete');
    }


    return this.rootService.remove(id, payload.userId)
  }
  
}
