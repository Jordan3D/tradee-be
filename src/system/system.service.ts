import {
  forwardRef, Inject,
  Injectable,
} from '@nestjs/common';
import { Redis } from 'ioredis';

import { InjectRedis } from '../util/redis';
import { Repository } from 'typeorm';
import { GameEntity } from '../model';
import { InjectRepository } from '@nestjs/typeorm';
import { dataExpire } from '../util';
import { GameService } from '../game/game.service';
import { UpdatesInfoResponseDto } from './dto/responses';
import { UpdateEntity } from '../model/update.entity';
import { IUser } from '../interfaces/user';
import { IUpdate } from '../interfaces/update.interface';
/** user service */
@Injectable()
export class SystemService {
  
  constructor(
    @InjectRepository(GameEntity)
    private readonly gameRepo:  Repository<GameEntity>,
    @InjectRepository(UpdateEntity)
    private readonly updateRepo:  Repository<UpdateEntity>,
    @InjectRedis() private readonly redis: Redis,
    @Inject(forwardRef(() => GameService))
    private readonly gameService: GameService
  ) {}
  
  async getOnlineUsers(): Promise<string[]> {
    const res = await this.redis.hgetall(`online-users`);
    
    return Object.keys(res);
  }
  
  async addOnlineUser(id: string): Promise<void> {
    await this.redis.hset(`online-users`, id, this.gameService.name);
  }
  
  async isUserIsOnline(id: string): Promise<boolean> {
    return !!await this.redis.hget(`online-users`, id);
  }
  
  async removeOnlineUser(id: string): Promise<number> {
    return await this.redis.hdel(`online-users`, id);
  }
  
  async clearOnlineUsers(): Promise<void> {
    await this.redis.del('online-users');
  }
  
  async getOnlineUsersCount(): Promise<number> {
    return await this.redis.hlen(`online-users`);
  }
  
  async checkGameClearing(): Promise<boolean> {
    const games = await this.gameRepo.query(`SELECT * FROM public.game WHERE "createdAt" > (CURRENT_TIMESTAMP - INTERVAL '${dataExpire + (60 * 60)} seconds') LIMIT 1`);
    
    return games.length ? !await this.gameService.getGame(`game_${games[0].id}`) : true
  }
  
  async createUpdate(data: Partial<Omit<IUpdate, | 'createdAt' | 'updatedAt'>>): Promise<UpdateEntity>{
    const update = await this.updateRepo.create(data);
    return await this.updateRepo.save(update);
  }
  
  async getLastUpdating(): Promise<UpdatesInfoResponseDto> {
    const resJSON = await this.redis.get('last-updating');
    return new UpdatesInfoResponseDto(JSON.parse(resJSON));
  }
  
  async setLastUpdating(id :string): Promise<UpdatesInfoResponseDto | undefined>{
    const update = await this.updateRepo.findOne(id);
    const lastUpdate = new UpdatesInfoResponseDto(update);
    await this.redis.set('last-updating', JSON.stringify(lastUpdate));
    return lastUpdate;
  }
}
