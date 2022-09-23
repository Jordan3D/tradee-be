import { Table, Column, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { BaseEntity } from '../models/base.entity';
import { UserEntity } from '../user/user.entity';

@Table({ modelName: 'DiaryItem', freezeTableName: true })
export class DiaryItemEntity extends BaseEntity {
  @Column({ type: DataType.STRING })
  title: string;

  @Column({ type: DataType.TEXT })
  content: string;

  @ForeignKey(() => UserEntity)
  authorId: string;

  @BelongsTo(() => UserEntity)
  author: UserEntity;
}