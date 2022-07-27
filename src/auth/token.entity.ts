import { Table, Column, DataType, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { UserEntity } from 'src/models';
import { BaseEntity } from '../models/base.entity';

@Table({ modelName: 'Token', freezeTableName: true })
export class TokenEntity extends BaseEntity {
  
  @Column({ type: DataType.STRING})
  tokenId: string;
  
  @BelongsTo(() => UserEntity)
  author: UserEntity;

  @ForeignKey(() => UserEntity)
  userId: string;
}