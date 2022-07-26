import { Table, Column, DataType, HasMany, HasOne } from 'sequelize-typescript';
import { BaseEntity } from './base.entity';
import { UserEntity } from './user.entity';

@Table({ modelName: 'comment' })
export class CommentEntity extends BaseEntity {
  @Column({ type: DataType.STRING})
  content: string;

  @HasOne(() => UserEntity)
  author: UserEntity;

  @Column({ type: DataType.NUMBER})
  rating: number

  @Column({ type: DataType.STRING})
  parentId: string;

  @Column({ type: DataType.STRING})
  parentType: 'note' | 'idea'
}