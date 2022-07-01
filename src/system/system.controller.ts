import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Logger,
  NotFoundException,
  Param,
  Post, Req,
  UseGuards,
} from '@nestjs/common';

const jwt = require('jsonwebtoken');

import { AuthGuard } from '@nestjs/passport';
import { SystemService } from './system.service';
import { InfoDto } from './dto/requests';
import { InfoResponseDto, UpdatesInfoResponseDto } from './dto/responses';
import { createUpdate, setUpdate } from './dto/requests/createUpdate.dto';
import { createUpdateResponseDTO } from './dto/responses/createUpdateRespose.dto';
/**
 * users controller
 */
@Controller('/system')
export class SystemController {
  /** logger */
  private readonly logger = new Logger(SystemController.name);

  constructor(
    private readonly systemService: SystemService
  ) {}
  
  @UseGuards(AuthGuard('admin_jwt'))
  @Post('/update/create')
  async createUpdate(@Body() data: createUpdate): Promise<createUpdateResponseDTO> {

    const update =  await this.systemService.createUpdate(data);

    return new createUpdateResponseDTO(update);
  }
  
  
  @UseGuards(AuthGuard('admin_jwt'))
  @Post('/updating')
  async setUpdating(@Body() data: setUpdate): Promise<UpdatesInfoResponseDto> {
    const {id} = data;
    // get update entity from db
    // if exist and date is > than now() send response with update
    // else Bad Request
    if(!id){
      throw new BadRequestException();
    } else {
      const res = this.systemService.setLastUpdating(id);
      
      if(!res){
        throw new BadRequestException();
      }
      
      return res;
    }
  }
  
  @UseGuards(AuthGuard('user_jwt'))
  @Get('/updates')
  async getUpdatesInfo(): Promise<UpdatesInfoResponseDto> {
    // next update in redis
    return await this.systemService.getLastUpdating();
  }

  @UseGuards(AuthGuard('admin_jwt'))
  @Post('/:info')
  async getInfo(@Body() data: InfoDto): Promise<InfoResponseDto> {

    const res = {};
    const dummy = new InfoResponseDto(1,1,1, true);

    await Promise.all(Object.keys(dummy).map( async key => {
      if(data[key] || data.all){
        if(key === 'playersOnline'){
          res[key] = await this.systemService.getOnlineUsers();
        }
        else if (key === 'playersOnlineCount'){
          res[key] = await this.systemService.getOnlineUsersCount();
        }
        else if (key === 'gameManagersCount'){
          res[key] = 1;
        }
        else if (key === 'gamesDynamicClear'){
          res[key] = await this.systemService.checkGameClearing();
        }
      }
    }));

    return res;
  }
}
