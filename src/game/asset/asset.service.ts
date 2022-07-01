import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  MethodNotAllowedException,
  NotFoundException,
  ConflictException,
  Injectable
} from '@nestjs/common';
import { Redis } from 'ioredis';
import * as uuid from 'uuid';

import { InjectRedis } from '../../util/redis/index';
import { ItemEntity } from '../../model/index';
import { IItem } from '../../interfaces/item.interface';
import { IAsset, IXAsset } from '../../interfaces/asset.interface';
import { ItemService } from '../../item/item.service';
import { GameService } from '../game.service';

/** asset service */
@Injectable()
export class AssetService {
  
  constructor(
    @InjectRedis() private readonly redis: Redis,
    private readonly itemService: ItemService,
    private readonly gameService: GameService
  ) {}
  
  async create(gameId: string, data: Partial<Omit<IAsset, 'id' | 'owner'>>): Promise<IAsset> {
    const _data = {...data, owner: gameId};
    const asset = new Asset(_data);
  
    await this.redis.rpush(`game_assets_${gameId}`,JSON.stringify(asset));
    await this.redis.hset(`all_assets_${gameId}`, asset.id ,JSON.stringify(asset));
    
    return asset;
  }
  
  async setTo(assetId: string, gameId: string, playerId?: string): Promise<boolean | undefined>{
    
    const assetJSON = await this.redis.hget(`all_assets_${gameId}`, assetId);
    
    if(!assetJSON){
      return undefined;
    }
    
    const asset = JSON.parse(assetJSON);
    const prevOwner = asset.owner;
    const redisNewOwnerId = playerId ? `player_assets_${playerId}` : `game_assets_${gameId}`;
    const redisPrevOwnerId = prevOwner === gameId ? `game_assets_${gameId}` : `player_assets_${playerId}`;
    
    // delete asset from prev owner list
    const assets = await this.redis.lrange(redisPrevOwnerId, 0, -1);
    const index = assets.indexOf(asset.id);
    if(await this.redis.lindex(redisPrevOwnerId, index) === asset.id){
      await this.redis.lrem(redisPrevOwnerId, 0, asset.id);
    } else {
      return undefined;
    }
    //
    // set asset to new owner list
    await this.redis.rpush(redisNewOwnerId, asset.id);
    asset.owner = playerId ? playerId : gameId;
    await this.redis.hset(`all_assets_${gameId}`, assetId, JSON.stringify(asset));
    
    return true
  }
  
  async get(gameId: string, assetId: string, set: 'default' | 'extended' = 'default'): Promise<IAsset | IXAsset | undefined> {
    const assetJSON = await this.redis.hget(`all_assets_${gameId}`, assetId);
    if(!assetJSON){
      return undefined;
    }
    
    const asset = JSON.parse(assetJSON);
    
    if(set === 'extended'){
      asset.item = await this.itemService.getById(asset.item);
    }
    
    return asset;
  }
  
  async removeAll(gameId: string): Promise<boolean | undefined> {
    const game = await this.gameService.getGame(gameId);
    
    await Promise.all(Object.values(game.players).map( async player => {
      await this.redis.del(`player_assets_${player.id}`);
    }));
    await this.redis.del(`game_assets_${game.id}`);
    await this.redis.hdel(`all_assets_${game.id}`);
    
    return true;
  }
}

class Asset implements IAsset{
  id: string;
  owner: string;
  item: string;
  isMortgaged: boolean;
  additional: object;
  color?: string;
  lvl: number;
  
  constructor(data){
    const {owner, item, isMortgaged, additional, color, lvl} = data;
    
    this.id = uuid.v4();
    this.owner = owner;
    this.item = item;
    this.isMortgaged = isMortgaged;
    this.additional = additional;
    this.color = color;
    this.lvl = lvl;
  }
}
