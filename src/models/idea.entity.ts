import { Table, Column, DataType, HasMany, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { BaseEntity } from './base.entity';
import { TagEntity } from './tag.entity';
import { UserEntity } from './user.entity';

@Table({ modelName: 'idea' })
export class IdeaEntity extends BaseEntity {
  @Column({ type: DataType.STRING })
  title: string;

  @Column({ type: DataType.STRING })
  content: string;

  @HasMany(() => TagEntity)
  tags: TagEntity[]

  @ForeignKey(() => UserEntity)
  authorId: string;

  @BelongsTo(() => UserEntity)
  author: UserEntity;

  @Column({ type: DataType.INTEGER})
  rating: number
}