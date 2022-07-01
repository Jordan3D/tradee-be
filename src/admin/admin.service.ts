import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { Redis } from 'ioredis';
import { InjectRepository } from '@nestjs/typeorm';
import { IAdmin } from '../interfaces/admin';
import { AdminEntity } from '../model';
import { Repository } from 'typeorm';

const bcrypt = require('bcrypt');
const saltRounds = 10;

import { InjectRedis } from '../util/redis';
/** user service */
@Injectable()
export class AdminService {
  
  constructor(
    @InjectRedis() private readonly redis: Redis,
    @InjectRepository(AdminEntity) private readonly adminRepo: Repository<AdminEntity>
  ) {}
  
  /**
   * create func
   * @param {Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>} user - user data
   * @returns {Promise<UserDocument>} - created user
   */
  async create(data: Partial<Omit<IAdmin, 'id' | 'createdAt' | 'updatedAt'>>): Promise<AdminEntity> {
    if (data.email !== undefined && (await this.getByEmail(data.email)) !== undefined)
      throw new ConflictException('Admin with provided email already exists');
  
    const pHash = await bcrypt.hash(data.password, saltRounds);
    const hashVResult = await bcrypt.compare(data.password, pHash);
  
    if(!hashVResult){
      throw new BadRequestException('Something went wrong');
    }
  
    data.password = pHash;
    
    const admin = this.adminRepo.create(data);
    
    return await this.adminRepo.save(admin);
  }
  
  /**
   * getByEmail func
   * @param {string} email - user email
   * @returns {Promise<UserDocument | null>} - user
   */
  getByEmail(email: string): Promise<AdminEntity | undefined> {

    return this.adminRepo.findOne({ email });
  }
  
  /**
   * getById func
   * @param {string} id - user id
   * @returns {Promise<UserDocument | null>} - user
   */
  async getById(id: string, omit?: string[]): Promise<AdminEntity | undefined> {
    const admin = await this.adminRepo.findOne(id);
    if(omit){
      omit.forEach(o => {
        if(admin[o] !== undefined){
          delete admin[o];
        }
      })
    }
    
    return admin;
  }
  
  /**
   * updateUser func
   * @param {string} id - user id
   * @param {string} email - user email
   * @returns {Promise<UserDocument | null>} - updated user
   */
  async update(id: string, updates: Partial<Omit<IAdmin, 'id' | 'createdAt' | 'updatedAt'>>,): Promise<AdminEntity | undefined> {
    try {
      await this.adminRepo.update(id, updates);
    } catch (error) {
      return error;
    }
    return this.adminRepo.findOne(id);
  }
}
