import { Table, Column, DataType, ForeignKey, HasMany, BelongsTo } from 'sequelize-typescript';
import { TagEntity, TagsEntity } from 'src/models';
import { BaseEntity } from '../models/base.entity';
import { UserEntity } from '../user/user.entity';

@Table({ modelName: 'JournalItem', freezeTableName: true })
export class JournalItemEntity extends BaseEntity {
  @Column({ type: DataType.STRING })
  title: string;

  @Column({ type: DataType.STRING })
  content: string;

  @ForeignKey(() => UserEntity)
  authorId: string;

  @BelongsTo(() => UserEntity)
  author: UserEntity;

  @Column({ type: DataType.JSON})
  pnls: string[];

  @Column({ type: DataType.JSON})
  transactions: string[];
}