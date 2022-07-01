import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity({ name: 'user' })
export class UserEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 20, default: '' })
  name: string;
  
  @Column({ type: 'varchar', length: 56, default: '' })
  email: string;
  
  @Column({ type: 'varchar', length: 200, default: '' })
  password: string;
  
  @Column({ type: 'varchar', length: 256, default: ''})
  avatar: string;
  
  @Column({ type: 'jsonb',  default: () => "'{\"language\": \"en\", \"volume\": 100}'"})
  options: {[keys: string]: any};
}