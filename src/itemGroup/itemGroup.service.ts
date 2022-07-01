import {
  ConflictException,
  Injectable
} from '@nestjs/common';
import { ItemGroupEntity } from '../model/index';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IItemGroup } from '../interfaces/itemGroup.interface';
import { UserEntity } from '../model';

/** asset service */
@Injectable()
export class ItemGroupService {
  
  constructor(
    @InjectRepository(ItemGroupEntity) private readonly itemGroupRepo: Repository<ItemGroupEntity>
  ) {}
  
  async create(data: Partial<Omit<IItemGroup, 'id' | 'createdAt' | 'updatedAt'>>): Promise<ItemGroupEntity> {
    const item = this.itemGroupRepo.create(data);
    
    return await this.itemGroupRepo.save(item);
  }
  
  async update(id: string, updates: Partial<Omit<IItemGroup, 'id' | 'createdAt' | 'updatedAt'>>,): Promise<ItemGroupEntity | undefined> {
    try {
      await this.itemGroupRepo.update(id, updates);
    } catch (error) {
      return error;
    }
    return this.itemGroupRepo.findOne(id);
  }
  
  async getById(id: string): Promise<ItemGroupEntity | undefined> {
    return await this.itemGroupRepo.findOne(id);
  }
  
  async getByName(name: string): Promise<ItemGroupEntity | undefined> {
    
    return await this.itemGroupRepo.findOne({ name });
  }
  
  async remove(id: string): Promise<ItemGroupEntity> {
    const one = await this.itemGroupRepo.findOne(id);
    const res = await this.itemGroupRepo.remove(one);
    return res;
  }
  
  async getAll(): Promise<ItemGroupEntity[]> {
    return await this.itemGroupRepo.find();
  }
}
