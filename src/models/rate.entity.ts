import { Table, Column, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { BaseEntity } from './base.entity';
import { UserEntity } from '../user/user.entity';

@Table({ modelName: 'Rate' })
export class RateEntity extends BaseEntity {
  @Column({type: DataType.BOOLEAN})
  isUp: boolean;

  @ForeignKey(() => UserEntity)
  authorId: string;

  @BelongsTo(() => UserEntity)
  author: UserEntity;
}