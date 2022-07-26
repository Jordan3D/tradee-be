import { Table, Column, DataType } from 'sequelize-typescript';
import { BaseEntity } from './base.entity';

@Table({ modelName: 'token' })
export class TokenEntity extends BaseEntity {
  
  @Column({ type: DataType.STRING})
  tokenId: string;
  
  @Column({ type: DataType.STRING })
  userId: string;
}