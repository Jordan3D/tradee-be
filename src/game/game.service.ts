import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  MethodNotAllowedException,
  NotFoundException,
  ConflictException,
  Inject,
  Injectable,
  forwardRef
} from '@nestjs/common';
import { Redis } from 'ioredis';
import * as uuid from 'uuid';
//import { User as IUser } from '../interfaces/user/user.interface';

import { InjectRedis } from '../util/redis';
import { UsersService } from '../users';
import { IGameSettingsValues } from '../interfaces/gameSettings.interface';
import { defaultGameSettings, gameConsts, playerColors, playerColorsError } from './game.constants';
import { GameSettingsDTO, GameConfigsDTO } from './dto/response';
import { IDPlayers, IGame, INewGameConfigs, ISPlayers, IXGame, IXPlayers } from '../interfaces/game.interface';
import { GameEntity } from '../model';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import GameSettings from './settings';
import Player from './player';
import { IPlayer, IPlayerUser } from '../interfaces/player.interface';
import { ManagerService } from './manager/manager.service';
import { actionConsts } from './game.constants';
import { IManager } from '../interfaces/manager.interface';
import { GameGateway } from './game.gateway';
import { dataExpire } from '../util';


/** user service */
@Injectable()
export class GameService {
  private gameManagers: object;
  name: string;
  
  constructor(
    @InjectRepository(GameEntity) private readonly gameRepo:  Repository<GameEntity>,
    @InjectRedis() private readonly redis: Redis,
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => ManagerService))
    private readonly managerService: ManagerService,
    @Inject(forwardRef(() => GameGateway))
    private readonly gameGateway: GameGateway
  ) {
  
    this.gameManagers = {};
    this.name = process.env.GAME_SERVICE;
  }
  
  async activateLeaveTimer(playerId: string, gameId: string): Promise<void> {
    const m = this.gameManagers[gameId];
  }
  
  async setGameLobbyOnline(gameId: string, playerId: string, value: boolean): Promise<object> {
    let players = await this.getGameLobbyOnline(gameId);
    players[playerId] = value;
    await this.redis.setex(`${gameId}-lobby-connection-status`, dataExpire, JSON.stringify(players));
    return players;
  }
  
  async getGameLobbyOnline(gameId: string): Promise<object> {
    return JSON.parse(await this.redis.get(`${gameId}-lobby-connection-status`));
  }

  async setScriptData(name: string, data: object): Promise<void> {
    await this.redis.set(name, JSON.stringify(data), 'EX', dataExpire);
  }

  async getScriptData(name: string): Promise<void> {
    const json = await this.redis.get(name);
    return JSON.parse(json);
  }
  
  async sendGameEvent(gameId: string, gameEvent: any, to?: string): Promise<void> {
    this.gameGateway.sendGameEvent(gameId, gameEvent, to);
  }
  
  async getCurrentData(userId: string): Promise<any> {
    const json = await this.redis.get(`current_${userId}`);
    return json ? JSON.parse(json) : undefined;
  }
  
  async setCurrentData(userId: string, value): Promise<any> {
    return await this.redis.setex(`current_${userId}`, dataExpire, JSON.stringify(value));
  }
  
  async removeCurrentData(userId: string): Promise<any> {
    return await this.redis.del(`current_${userId}`);
  }
  
  async removePlayerConnection(playerId: string, gameId: string): Promise<void> {
    await this.gameGateway.removePlayerFromList(playerId, gameId);
  }
  
  async eraseGameInfo(gameId: string): Promise<any> {
    const m = this.gameManagers[gameId];
    
    if(m){
      await this.managerService.dismiss(m);
  
      delete this.gameManagers[gameId];
    }
  }
  
  async incomingAction(gameId: string, action: any, from: string): Promise<void> {
    const m = this.gameManagers[gameId];
    
    await this.managerService.processAction(m, action, from);
  };
  
  async setupRequestCheck(userId: string): Promise<boolean>{
    const user = await this.usersService.getById(userId);
    
    if(user && !user.isDeleted){
      return true;
    }
    return false;
  }
  
  async getGameSettings(gameId?: string): Promise<GameSettingsDTO>{
    if(gameId){
      const game = await this.gameRepo.findOne(gameId);
      return game.settings;
    }
    return defaultGameSettings
  }
  
  async getGameConfigs(): Promise<GameConfigsDTO>{
    return {
      constants: {
        action: actionConsts
      }
    }
  }
  
  async getGamePlayers(gameId: string, set: 'short' | 'default' | 'extended' = 'default'):
    Promise<ISPlayers | IDPlayers | IXPlayers | undefined>
  {
    if(set === 'short'){
      const game: IGame = await this.getGame(gameId);
      
      return game.players; // ISPlayers
    } else if (set === 'default') {
      const players = await this.redis.hgetall(`players_${gameId}`) as any;
      for(let p in players){
        players[p] = JSON.parse(players[p]);
      }
      
      return players as IDPlayers; // IDPlayers
    } else if (set === 'extended') {
      const players = await this.getGamePlayers(gameId, 'default') as IDPlayers;
      for(let p in players){
        players[p] = {
          ...players[p],
          user: await this.usersService.getById(players[p].userId, ['password', 'isDeleted', 'updatedAt', 'updatedAt'])
        } as IPlayerUser;
      }
      
      return players;  // IXPlayers
    }
    return undefined;
  }
  
  async setGameSettings(gameId: string, settings: IGameSettingsValues): Promise<IGameSettingsValues | undefined> {
    if(!gameId){
      throw new BadRequestException();
    }
    const game = await this.getGame(gameId);
    game.settings = settings;
    await await this.redis.set(`game_${game.id}`, JSON.stringify(game), 'EX', dataExpire);
    return game.settings;
    
  }
  
  async getNewGame(newGameConfigs: INewGameConfigs, userId: string): Promise<IGame | undefined>{
    try {
  
      const gameData = {
        name: newGameConfigs.name,
        password: newGameConfigs.password,
        isPrivate: !!newGameConfigs.password,
        phase: 'new',
        subphase: '',
        players: {},
        service: this.name,
        settings: new GameSettings(newGameConfigs.settings)
      };
      const hostData: Omit<IPlayer, 'id'> = {
        userId,
        status: 'new',
        gameId: '',
        role: 'host',
        color: playerColors[0]
      };
  
      // game create
      const game = this.gameRepo.create(gameData);
  
      // host player create
      const host = new Player({...hostData, gameId: game.id});
  
      game.players[host.id] = {id: host.id, role: 'host'};
      await this.gameRepo.save(game);
      await this.redis.hset(`players_${game.id}`, host.id, JSON.stringify(host));
      await this.redis.expire(`players_${game.id}`, dataExpire);
      await this.redis.set(`game_${game.id}`, JSON.stringify(game), 'EX', dataExpire);
      await this.redis.setex(`${game.id}-lobby-connection-status`, 60 * 60, JSON.stringify({}));
      return {
        ...game,
        settings: game.settings
      };
    } catch (e) {
      return Promise.reject(e)
    }
  }
  
  async removeGame(gameId: string): Promise<void>{
    await this.redis.del(`players_${gameId}`);
    await this.redis.del(`game_${gameId}`);
  };
  
  async newGameInitEntities(gameId: string): Promise<void>{
    this.gameManagers[gameId] = await this.managerService.create(gameId);
  }
  
  async getGame(gameId: string, set: 'dynamic' | 'static' = 'dynamic'): Promise<IGame | undefined>{
    let game : IGame;
    if(set === 'dynamic'){
      game = await this.getByIdFromRedis(gameId);
    } else if (set === 'static') {
      game = await this.getByIdFromDB(gameId);
    }
    return game;
  }
  
  async setGamePhase({game, gameId, phase}: {game?: IGame, gameId: string, phase: string}): Promise<IGame | undefined>{
    const localGame = game ? game : await this.getGame(gameId);
    localGame.phase = phase;
    await this.redis.setex(`game_${gameId}`, dataExpire, JSON.stringify(localGame));
    await this.gameRepo.update(gameId, {phase});
    
    return localGame;
  }
  
  async setGameSubPhase({game, gameId, subphase}: {game?: IGame, gameId: string, subphase: string}): Promise<IGame | undefined>{
    const localGame = game ? game : await this.getGame(gameId);
    localGame.subphase = subphase;
    await this.redis.setex(`game_${gameId}`, dataExpire, JSON.stringify(localGame));
  
    return localGame;
  }
  
  async addPlayer({gameId, userId, game}: {gameId: string, userId: string, game?: IGame}): Promise<IPlayer | undefined>{
    const localGame = game ? game : await this.getGame(gameId);
  
    const playerData: Omit<IPlayer, 'id'> = {
      userId,
      status: 'new',
      gameId,
      role: 'player',
      color: await this.pickRandomColor(gameId)
    };
    
    const player = new Player({...playerData, gameId: localGame.id});
  
    if(Object.keys(localGame.players).length < localGame.settings.playersCount){
      localGame.players[player.id] = {id: player.id, role: 'player'};
      
      await this.gameRepo.update(localGame.id, {players: localGame.players} as any);
      //
      await this.redis.hset(`players_${localGame.id}`, player.id, JSON.stringify(player));
      await this.redis.setex(`game_${gameId}`, dataExpire, JSON.stringify(localGame));
      return player;
    }
    return undefined;
  }
  
  async setPlayerStatus({gameId, playerId, status}: {gameId: string, playerId: string, status: string})
    : Promise<boolean>
  {
    const playerJson =  await this.redis.hget(`players_${gameId}`, playerId);
    const player = JSON.parse(playerJson) as IPlayer;
    player.status = status;
    
    await this.redis.hset(`players_${gameId}`, player.id, JSON.stringify(player));
    
    return true;
  }
  
  async deletePlayer({gameId, playerId, game}: {gameId: string, playerId: string, game?: IGame}): Promise<boolean>{
    const localGame = game ? game : await this.getGame(gameId);
    const player = await this.redis.hdel(`players_${gameId}`, playerId);
  
    delete localGame.players[playerId];
  
    await this.redis.setex(`game_${gameId}`, dataExpire, JSON.stringify(localGame));
    await this.gameRepo.update(gameId, {players: localGame.players} as any);
    
    return !!player;
  }
  
  async getByIdFromDB(gameId: string): Promise<GameEntity | undefined>{
    if(!gameId){
      throw new BadRequestException();
    }
    return await this.gameRepo.findOne(gameId);
  }
  
  async getByIdFromRedis(gameId: string): Promise<IGame | undefined>{
    if(!gameId){
      throw new BadRequestException();
    }
    const gameJson = await this.redis.get(`game_${gameId}`);
    if(gameJson){
      const game: IGame = JSON.parse(gameJson);
      return game;
    } else {
      return undefined;
    }
  }
  
  async removeNewGame(gameId: string): Promise<boolean>{
    const game = await this.getGame(gameId);
    
    if(!game.id && game.id !== 'new'){
      throw new NotFoundException();
    } else {
      const delRes = await this.gameRepo.remove(game);
      return delRes.id === undefined && await this.redis.del(gameId) !== 0;
    }
  }
  
  async getOverallGameInfo(gameId: string): Promise<any | undefined>{
    const game = await this.getGame(gameId, 'dynamic');
    
    const m: IManager = this.gameManagers[gameId];
    
    if(!m){
      return undefined;
    }
    
    if(game.phase === 'init'){
      return {
        assets: m.assets,
        steps: m.map.steps
      }
    } else if (game.phase === 'start'){
      return {
        assets: m.assets,
        steps: m.map.steps,
        playersMoney: m.playersMoney,
        playersPosition: m.playersPosition,
        playersSequence: m.playersSequence,
        playersInJail: m.playersInJail,
        playersOnline: m.playersOnline
      }
    } else if (game.phase === 'main'){
      
      const xGame = { ...game, players: {} as any } as IXGame;
      xGame.players = await this.getGamePlayers(gameId, 'extended') as IXPlayers;
      
      return {
        game: xGame,
        assets: m.assets,
        steps: m.map.steps,
        playersMoney: m.playersMoney,
        playersInJail: m.playersInJail,
        playersPosition: m.playersPosition,
        playersSequence: m.playersSequence,
        houseCount: m.houseCount,
        hotelCount: m.hotelCount,
        turn: m.turn,
        dices: m.prevDices,
        timer: m.timer ? {value: m.timer.value, date: m.timer.date, verification: m.timer.verification, pause: m.timer.pause} : {value: 0},
        subPhase: m.subPhase
      }
    }
  }
  
  async getOverallGameInfoWhileResuming(gameId: string): Promise<any | undefined>{
    const game = await this.getGame(gameId, 'dynamic');
    
    const m: IManager = this.gameManagers[gameId];
    
    if(!m && !['new', 'setup', 'init'].includes(game.phase)){
      return undefined;
    }
    
  
    const xGame = { ...game, players: {} as any } as IXGame;
    xGame.players = await this.getGamePlayers(gameId, 'extended') as IXPlayers;
    
    if(['new', 'setup', 'init'].includes(game.phase)){
      return {
        game: xGame,
      }
    } else if (game.phase === 'start'){
      
      return {
        game: xGame,
        assets: m.assets,
        steps: m.map.steps
      }
    } else if (game.phase === 'main'){
      return {
        game: xGame,
        assets: m.assets,
        steps: m.map.steps
      }
    }
  }
  
  async searchGames({id, name, max}: {id: string, name: string, max: number}): Promise<GameEntity[]>{
    let res = id ? await this.gameRepo.findOne(id, {where: {phase: 'setup'}}) : undefined;
    return res ? [res] : await this.gameRepo.query(
      `SELECT id,players,settings,"isPrivate",name FROM game
      WHERE phase='setup' AND name ILIKE '%${name}%'
      ${ max ? `AND settings @> '{"playersCount":${max}}'` : ''}
      AND "createdAt" > (CURRENT_TIMESTAMP - INTERVAL '${dataExpire} seconds')
      ORDER BY "createdAt" DESC
      `,
    );
  }
  
  async startGame(gameId: string): Promise<any | undefined>{
    const m: IManager = this.gameManagers[gameId];
    
    await this.managerService.startGame(m);
  };
  
  async pickRandomColor(gameId: string): Promise<string> {
    let colors = playerColors.slice();
    
    const players = await this.getGamePlayers(gameId);
    
    Object.values(players).forEach((p: IPlayer) => {
      const index = colors.indexOf(p.color);
      
      if(index >= 0) {
        colors.splice(index, 1);
      }
    });
    
    const randIndex = Math.floor(Math.random() * (colors.length + 1));
    
    return colors.length && colors[randIndex] ? colors[randIndex] : playerColorsError;
  }
  
  async updateUserGames(userId: string, creation?: boolean): Promise<number | undefined> {
    const json = await this.redis.get(`games_${userId}`);
    if(json){
      const data = JSON.parse(json);
      
      if(creation){
        if(data.games >= 1){
          await this.redis.set(`games_${userId}`, JSON.stringify({games: data.games - 1, date: Date.now()}));
          
          return data.games - 1;
        }
        return undefined;
        
      } else {
        if(data.games !== gameConsts.gamesLimit || (data.date && (Date.now() - data.date) / 1000 > 25 )){
          await this.redis.set(`games_${userId}`, JSON.stringify({games: gameConsts.gamesLimit}));
        }
  
        return gameConsts.gamesLimit;
      }
      
    } else {
      await this.redis.set(`games_${userId}`, JSON.stringify({games: gameConsts.gamesLimit}));
      return gameConsts.gamesLimit;
    }
  };
}
