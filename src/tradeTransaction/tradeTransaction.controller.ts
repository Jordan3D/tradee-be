import {
  Body,
  Controller,
  Get,
  Logger,
  NotFoundException,
  Param,
  Post,
  BadRequestException,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';

const jwt = require('jsonwebtoken');

import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import config from '../config';
import { getToken } from '../util';
import { TradeTransactionService } from './tradeTransaction.service';
import { TradeTransactionEntity } from './tradeTransaction.entity';
import { ITradeTransaction } from 'src/interfaces/tradeTransaction.interface';


@Controller('/trade-transaction')
export class TradeTransactionController {

  private readonly logger = new Logger(TradeTransactionController.name);
  constructor(private readonly rootService: TradeTransactionService) { }

  // for input search
  @UseGuards(AuthGuard('jwt'))
  @Post('/get-ids')
  async findByIds(@Req() request: Request, @Body() data: string[]): Promise<ITradeTransaction[]> {
    return this.rootService.getByIds(data)
  }

  // for input search
  @UseGuards(AuthGuard('jwt'))
  @Get('/list')
  async findBy(@Req() request: Request, @Query() query): Promise<Readonly<{
    data: ITradeTransaction[], total: number, offset: number, limit: number
  }>> {
    const token = getToken(request);
    const payload = jwt.verify(token, config.jwtSecret);

    try {
      const [_orderBy] = query.orderBy ? query.orderBy?.split(',') : [];

      if (_orderBy && !Object.keys(TradeTransactionEntity.getAttributes()).includes(_orderBy)) {
        throw new Error('Wrong order params')
      }
    } catch (e) {
      throw new BadRequestException(e.message)
    }

    return this.rootService.findBy({ ...query, authorId: payload.userId })
  }
}
