import { Table, Column, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { BaseEntity } from '../models/base.entity';
import { UserEntity } from '../user/user.entity';

@Table({ modelName: 'JournalItem', freezeTableName: true })
export class JournalItemEntity extends BaseEntity {
  @Column({ type: DataType.STRING })
  title: string;

  @Column({ type: DataType.TEXT })
  content: string;

  @ForeignKey(() => UserEntity)
  authorId: string;

  @BelongsTo(() => UserEntity)
  author: UserEntity;

  @Column({ type: DataType.JSON, defaultValue: []})
  pnls: string[];

  @Column({ type: DataType.JSON, defaultValue: []})
  transactions: string[];

  @Column({ type: DataType.JSON, defaultValue: []})
  ideas: string[];
}