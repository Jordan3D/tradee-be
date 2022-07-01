import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from '../auth/jwt.strategy';
import config from '../config/index';
import { GameService } from './game.service';
import { GameEntity } from '../model';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from '../util/redis/redis.module';
import { configService } from '../config/config.service';
import { IGameSettings, IGameSettingsValues } from '../interfaces/gameSettings.interface';
import { defaultGameSettings } from './game.constants';
import { UsersModule } from '../users';
import * as uuid from 'uuid';
import { IDPlayers, IGame, INewGameConfigs, ISPlayers, IXPlayers } from '../interfaces/game.interface';
import { IPlayer, IPlayerUser } from '../interfaces/player.interface';
import { ManagerModule } from './manager/manager.module';
import { GameGateway } from './game.gateway';
import { GameModule } from './game.module';

const testNewGameConfig: INewGameConfigs = {
  name: 'newGame',
  password: '1111',
  //@ts-ignore
  settings: {
    playersCount: 4,
    circleMoney: 1000,
    startMoney: 1000
  }
};
//@ts-ignore
const testDifferentSettings: IGameSettingsValues = {
  playersCount: 5,
  circleMoney: 1500,
  startMoney: 1000
};

const testUserId: string = '1195e6f5-6db3-420b-a489-758a8c15d16d';
const testUserId2: string = 'e248760b-2e68-4334-bd97-30a9bb68b15f';

describe('GameService', () => {
  let service: GameService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(configService.getTypeOrmConfig(true)),
        TypeOrmModule.forFeature([GameEntity]),
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
          secret: config.jwtSecret,
          signOptions: { expiresIn: config.jwt.tokens.access.expiresIn },
        }),
        RedisModule.registerAsync({
          useFactory: () => config.redis,
        }),
        UsersModule,
        ManagerModule,
        GameModule
      ],
      providers: [
        GameGateway,
        GameService,
        JwtStrategy,
      ],
      exports: [GameService],
    }).compile();

    service = module.get<GameService>(GameService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  
  describe('new game', () => {
    let gameSettings: IGameSettings;
    let newGame: IGame;
    let gameFromDB: IGame;
    let player: IPlayer;
    let playersS: ISPlayers;
    let playersD: IDPlayers;
    let playersX: IXPlayers;
  
    it('should pass settings without gameId', async () => {
      //@ts-ignore
      gameSettings = await service.getGameSettings();
      //@ts-ignore
      expect(gameSettings.startMoney).toBe(defaultGameSettings.startMoney);
    });
  
    it('should create new game', async () => {
      newGame = await service.getNewGame(testNewGameConfig, testUserId);
      
      expect(newGame).toHaveProperty('id');
    });
  
    it('should pass a game by id', async () => {
      const game : IGame = await service.getGame(newGame.id);
      
      expect(game).toHaveProperty('players');
    });
  
    it('should add a player to the game', async () => {
      player = await service.addPlayer({gameId: newGame.id, userId: testUserId2});
      
      expect(player).toHaveProperty('userId');
      expect(player.userId).toBe(testUserId2);
    });
  
    it('should set status to player', async () => {
      const result = await service.setPlayerStatus({gameId: newGame.id, playerId: player.id, status: 'setup'});
      playersD = await service.getGamePlayers(newGame.id) as IDPlayers;
      
      expect(result).toBe(true);
      expect(playersD[player.id].status).toBe('setup');
    });
  
    it('should delete player from the game', async () => {
      const result = await service.deletePlayer({gameId: newGame.id, playerId: player.id});
      playersD = await service.getGamePlayers(newGame.id) as IDPlayers;
    
      expect(result).toBe(true);
      expect(playersD[player.id]).toBe(undefined);
    });
  
    it('should pass a game from StaticDB', async () => {
      gameFromDB = await service.getByIdFromDB(newGame.id);
      
      expect(gameFromDB).toHaveProperty('id');
    });
  
    it('should pass a game from DynamicDB', async () => {
      gameFromDB = undefined;
      gameFromDB = await service.getByIdFromRedis(newGame.id);
      
      expect(gameFromDB).toHaveProperty('id');
    });

    it('should pass settings with gameId', async () => {
      //@ts-ignore
      gameSettings = await service.getGameSettings(newGame.id);
      
      expect(gameSettings.playersCount).toBe(testNewGameConfig.settings.playersCount);
    });
    
    it('should pass players from game', async () => {
      playersS = await service.getGamePlayers(newGame.id, 'short') as ISPlayers;
      playersD = await service.getGamePlayers(newGame.id) as IDPlayers;
      playersX = await service.getGamePlayers(newGame.id, 'extended') as IXPlayers;
  
      expect(Object.values(playersS)[0]).not.toHaveProperty('status');
      expect(Object.values(playersD)[0]).toHaveProperty('status');
      expect(Object.values(playersX)[0]).toHaveProperty('user');
    });
  
    it('should set game settings', async () => {
      const result: IGameSettingsValues = await service.setGameSettings(newGame.id, testDifferentSettings);
      
      expect(result.playersCount).not.toBe(testNewGameConfig.settings.playersCount);
    });

    it('should delete new game', async () => {
      const result = await service.removeNewGame(newGame.id);
      
      expect(result).toBe(true);
    });
  });

  // describe('error', () => {
  //   const invalidUser: CreateUserBody = {
  //     email: 'testingInvalid@gmail.com',
  //     password: 'pass',
  //     name: 'testingInvalid'
  //   };
  //   it('should return undefined for invalid email', async () => {
  //     expect(await service.getByEmail(invalidUser.email)).toBe(undefined);
  //   });
  // });
});
