import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { IUser } from '../interfaces/user';
import { UserEntity } from 'src/models';

import { TUserConfig } from 'src/interfaces/user/user.interface';
const bcrypt = require('bcrypt');
const saltRounds = 10;

/** user service */
@Injectable()
export class UsersService {
  
  constructor(
    @InjectModel(UserEntity) private readonly userModel: typeof UserEntity
  ) {}

  async create(data: Omit<IUser, 'id' | 'createdAt' | 'updatedAt' | 'config'>): Promise<UserEntity> {
    if (await this.getByEmail(data.email))
      throw new ConflictException('User with provided email already exists');
      
    if (await this.getByUsername(data.username))
      throw new ConflictException('User with provided username already exists');
  
    const pHash = await bcrypt.hash(data.password, saltRounds);
    const hashVResult = await bcrypt.compare(data.password, pHash);
    
    if(!hashVResult){
      throw new BadRequestException('Something went wrong');
    }

    const dataToCreate = {...data} as typeof data & {config: TUserConfig};
    
    dataToCreate.password = pHash;
    dataToCreate.config = {utc: 3}; 
    
    return await this.userModel.create(dataToCreate, {raw: true});
  }
  
  
  /**
   * getByEmail func
   * @param {string} email - user email
   * @returns {Promise<IUser | null>} - user
   */
  async getByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.userModel.findOne({ where: {email}, raw: true });
    return user;
  }
  
  /**
   * getByUsername func
   * @param {string} username
   * @returns {Promise<User | null>} - user
   */
   async getByUsername(username: string): Promise<UserEntity | null> {
    const user = await this.userModel.findOne({ where: {username}, raw: true });
    return user;
  }

  /**
   * getById func
   * @param {string} id - user id
   * @returns {Promise<UserDocument | null>} - user
   */
  async getById(id: string, omit?: string[]): Promise<UserEntity | null> {
    const user = await this.userModel.findOne({where: {id}, raw: true});
    
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
    return this.userModel.count();
  }
  
  /**
   * updateUser func
   * @param {string} id - user id
   * @param {string} email - user email
   * @returns {Promise<UserDocument | null>} - updated user
   */
  async update(id: string, updates: Partial<Omit<IUser, 'id' | 'createdAt' | 'updatedAt'>>,): Promise<UserEntity | null> {
    try {
      await this.userModel.update(updates, {where: {id}});
    } catch (error) {
      return error;
    }
    return this.userModel.findOne({where:{id}});
  }
}
