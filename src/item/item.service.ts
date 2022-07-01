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
import { ItemEntity } from '../model';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IUser } from '../interfaces/user';
import { IItem } from '../interfaces/item.interface';

/** asset service */
@Injectable()
export class ItemService {
  
  constructor(
    @InjectRepository(ItemEntity) private readonly itemRepo: Repository<ItemEntity>
  ) {}
  
  async create(data: Partial<Omit<IItem, 'id' | 'createdAt' | 'updatedAt'>>): Promise<ItemEntity> {
    if (data.name !== undefined && (await this.getByName(data.name)) !== undefined)
      throw new ConflictException('Item with provided name already exists');
    
    const item = this.itemRepo.create(data);
    
    return await this.itemRepo.save(item);
  }
  
  async update(id: string, updates: Partial<Omit<IUser, 'id' | 'createdAt' | 'updatedAt'>>,): Promise<ItemEntity | undefined> {
    try {
      await this.itemRepo.update(id, updates);
    } catch (error) {
      return error;
    }
    return this.itemRepo.findOne(id);
  }
  
  async getById(id: string): Promise<ItemEntity | undefined> {
    return await this.itemRepo.findOne(id);
  }
  
  async remove(id: string): Promise<ItemEntity> {
    const one = await this.itemRepo.findOne(id);
    const res = await this.itemRepo.remove(one);
    return res;
  }
  
  async getAll(): Promise<ItemEntity[]> {
    return await this.itemRepo.find();
  }
  
  async getByName(name: string): Promise<ItemEntity> {
    return await this.itemRepo.findOne({name});
  }
}
