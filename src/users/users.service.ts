import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { Redis } from 'ioredis';
import { InjectRepository } from '@nestjs/typeorm';
import { IUser } from '../interfaces/user';
import { UserEntity, FileEntity } from '../model';
import { Repository } from 'typeorm';
import * as uuid from 'uuid';
const bcrypt = require('bcrypt');
const saltRounds = 10;

import { InjectRedis } from '../util/redis';
import { FileService } from '../file/file.service';
/** user service */
@Injectable()
export class UsersService {
  
  constructor(
    @InjectRedis() private readonly redis: Redis,
    @InjectRepository(UserEntity) private readonly userRepo: Repository<UserEntity>,
    private readonly fileService: FileService
  ) {}
  
  /**
   * create func
   * @param {Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>} user - user data
   * @returns {Promise<UserDocument>} - created user
   */
  async create(data: Partial<Omit<IUser, 'id' | 'createdAt' | 'updatedAt'>>): Promise<UserEntity> {
    if (data.email !== undefined && (await this.getByEmail(data.email)) !== undefined)
      throw new ConflictException('User with provided email already exists');
  
    const pHash = await bcrypt.hash(data.password, saltRounds);
    const hashVResult = await bcrypt.compare(data.password, pHash);
    
    if(!hashVResult){
      throw new BadRequestException('Something went wrong');
    }
    
    data.password = pHash;
  
    const user = this.userRepo.create(data);
    
    return await this.userRepo.save(user);
  }
  
  /**
   * getByEmail func
   * @param {string} email - user email
   * @returns {Promise<UserDocument | null>} - user
   */
  async getByEmail(email: string): Promise<UserEntity | undefined> {
    const user = await this.userRepo.findOne({ email });
    if(user && user.avatar){
      const avatar = await this.fileService.getById(user.avatar);
      user.avatar = avatar.url;
    }
    return user;
  }
  
  /**
   * getById func
   * @param {string} id - user id
   * @returns {Promise<UserDocument | null>} - user
   */
  async getById(id: string, omit?: string[]): Promise<UserEntity | undefined> {
    const user = await this.userRepo.findOne(id);
    
    if(user && user.avatar){
      const avatar = await this.fileService.getById(user.avatar);
      user.avatar = avatar.url;
    }
    
    if(omit){
      omit.forEach(o => {
        if(user[o] !== undefined){
          delete user[o];
        }
      })
    }
    
    return user;
  }
  
  count() {
    return this.userRepo.count();
  }
  
  /**
   * updateUser func
   * @param {string} id - user id
   * @param {string} email - user email
   * @returns {Promise<UserDocument | null>} - updated user
   */
  async update(id: string, updates: Partial<Omit<IUser, 'id' | 'createdAt' | 'updatedAt'>>,): Promise<UserEntity | undefined> {
    try {
      await this.userRepo.update(id, updates);
    } catch (error) {
      return error;
    }
    return this.userRepo.findOne(id);
  }

  /**
   * deleteById func
   * @param {string} id - user id
   * @returns {Promise<UserDocument | null>} - user
   */
  async delete(id: string): Promise<boolean> {
    const one = await this.userRepo.findOne(id);
    one.isDeleted = true;
    const res = await this.userRepo.update(id, {isDeleted: true});
    
    return res.raw.isDeleted === true
  }
  
  /**
   * removeById func
   * @param {string} id - user id
   * @returns {Promise<UserDocument | null>} - user
   */
  async remove(id: string): Promise<UserEntity> {
    const one = await this.userRepo.findOne(id);
    const res = await this.userRepo.remove(one);
    return res;
  }
  
  async uploadAvatar({buffer, name, userId}: {buffer: Buffer, name: string, userId: string}): Promise<FileEntity>{
    const user = await this.userRepo.findOne(userId);
    
    if(user.avatar){
      await this.fileService.deletePublicFile(user.avatar);
    }
    const newFile = await this.fileService.uploadPublicFile(buffer, `${userId}_avatar_${name}`);
    await this.userRepo.update(userId, {avatar: newFile.id});
  
    return newFile;
  }
}
