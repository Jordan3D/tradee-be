import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Logger,
  NotFoundException,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { GameService } from './game.service';
import { GameSettingsDTO, NewGameResponseDTO, GameConfigsDTO } from './dto/response';
import { NewGameConfigsDTO, SearchGameDTO } from './dto/request';
import { getToken } from '../util';
import config from '../config/index';
import { INewGameConfigs } from '../interfaces/game.interface';


const jwt = require('jsonwebtoken');

/**
 * users controller
 */
@Controller('/game')
export class GameController {
  /** logger */
  private readonly logger = new Logger(GameController.name);
  /**
   * UsersController
   * @param {GameService} gameService - inject
   */
  constructor(private readonly gameService: GameService) {}
  
  @UseGuards(AuthGuard('user_jwt'))
  @Get('/settingsConfigs')
  async settingsConfigs(): Promise<GameSettingsDTO> {
    return await this.gameService.getGameSettings()
  }
  
  @UseGuards(AuthGuard('user_jwt'))
  @Get('/configs')
  async configs(): Promise<GameConfigsDTO> {
    return await this.gameService.getGameConfigs()
  }
  
  @UseGuards(AuthGuard('user_jwt'))
  @Get('/current')
  async current(@Req() request: Request): Promise<any> {
    const token = getToken(request);
    const payload = jwt.verify(token, config.jwtSecret);
    const result = await this.gameService.getCurrentData(payload.userId);
    return result ? result : {};
  }
  
  @UseGuards(AuthGuard('user_jwt'))
  @Post('/new')
  async newGame(@Body() userGameSettings: NewGameConfigsDTO, @Req() request: Request): Promise<NewGameResponseDTO> {
    
    const token = getToken(request);
    const payload = jwt.verify(token, config.jwtSecret);
    const gamesAllowToCreate = await this.gameService.updateUserGames(payload.userId, true);
    
    if(gamesAllowToCreate === undefined){
      throw new BadRequestException('too many game creation requests');
    }
    
    const game = await this.gameService.getNewGame(userGameSettings, payload.userId);
    const players = await this.gameService.getGamePlayers(game.id);

    return {
      gameId: game.id,
      playerId: Object.values(players).find(p => p.role === 'host').id
    }
  }
  
  @UseGuards(AuthGuard('jwt'))
  @Post('/search')
  async searchGame(@Body() body: SearchGameDTO, @Req() request: Request): Promise<{list: object[]}> {
    const list = await this.gameService.searchGames(body);
    return {
      list
    }
  }
  
  @UseGuards(AuthGuard('user_jwt'))
  @Post('/joinCheck')
  async joinCheck(@Body() body: {id: string, password: string}, @Req() request: Request): Promise<boolean> {
    const game = await this.gameService.getGame(body.id);
    
    if(game.password === body.password){
      return true;
    } else {
      throw new BadRequestException();
    }
  }
}
