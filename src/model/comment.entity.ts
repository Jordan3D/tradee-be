import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'comment' })
export class CommentEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 400, default: '' })
  content: string;

  @ManyToOne(() => UserEntity, entity => entity.id, {onDelete: 'NO ACTION', nullable: false})
  author: UserEntity;

  @Column({ type: 'integer', default: 0})
  rating: number

  @Column({ type: 'varchar'})
  parentId: string;

  @Column({ type: 'varchar'})
  parentType: 'note' | 'idea'
}