import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity({ name: 'token' })
export class TokenEntity extends BaseEntity {
  
  @Column({ type: 'varchar', length: 300 })
  tokenId: string;
  
  @Column({ type: 'varchar', length: 300 })
  userId: string;
}