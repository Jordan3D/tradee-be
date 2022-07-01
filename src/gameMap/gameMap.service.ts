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

import { InjectRedis } from '../util/redis';
import { GameMapEntity } from '../model';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IGameMap } from '../interfaces/gameMap.interface';

/** asset service */
@Injectable()
export class GameMapService {
  
  constructor(
    @InjectRepository(GameMapEntity) private readonly gameMapRepo: Repository<GameMapEntity>
  ) {}
  
  async create(data: Partial<Omit<IGameMap, 'id' | 'createdAt' | 'updatedAt'>>): Promise<GameMapEntity> {
    if (data.name !== undefined && (await this.getByName(data.name)) !== undefined)
      throw new ConflictException('Item with provided name already exists');
    
    const item = this.gameMapRepo.create(data);
    
    return await this.gameMapRepo.save(item);
  }
  
  async update(id: string, updates: Partial<Omit<IGameMap, 'id' | 'createdAt' | 'updatedAt'>>): Promise<GameMapEntity | undefined> {
    try {
      await this.gameMapRepo.update(id, updates);
    } catch (error) {
      return error;
    }
    return this.gameMapRepo.findOne(id);
  }
  
  async getById(id: string): Promise<GameMapEntity | undefined> {
    return await this.gameMapRepo.findOne(id);
  }
  
  async remove(id: string): Promise<GameMapEntity> {
    const one = await this.gameMapRepo.findOne(id);
    const res = await this.gameMapRepo.remove(one);
    return res;
  }
  
  async getAll(): Promise<GameMapEntity[]> {
    return await this.gameMapRepo.find();
  }
  
  async getByName(name: string): Promise<GameMapEntity> {
    return await this.gameMapRepo.findOne({name});
  }
}
