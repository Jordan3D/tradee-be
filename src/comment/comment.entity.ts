import { Table, Column, DataType, ForeignKey } from 'sequelize-typescript';
import { BaseEntity } from '../models/base.entity';
import { UserEntity } from '../user/user.entity';

@Table({ modelName: 'Comment', freezeTableName: true })
export class CommentEntity extends BaseEntity {
  @Column({ type: DataType.STRING})
  content: string;

  @ForeignKey(()=>UserEntity)
  authorId: string;

  @Column({ type: DataType.NUMBER})
  rating: number

  @Column({ type: DataType.STRING})
  parentId: string;

  @Column({ type: DataType.STRING})
  parentType: 'note' | 'idea'
}