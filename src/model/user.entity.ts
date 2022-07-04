import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity({ name: 'user' })
export class UserEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 20, default: '' })
  username: string;
  
  @Column({ type: 'varchar', length: 56, default: '' })
  email: string;
  
  @Column({ type: 'varchar', length: 200, default: '' })
  password: string;
}