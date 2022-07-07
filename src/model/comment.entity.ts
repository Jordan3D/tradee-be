import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { CommentedEntity } from './commented.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'comment' })
export class CommentEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 400, default: '' })
  content: string;

  @ManyToOne(() => UserEntity, entity => entity.id, {onDelete: 'NO ACTION', nullable: false})
  author: UserEntity;

  @Column({ type: 'integer', default: 0})
  rating: number

  @ManyToOne(() => CommentedEntity, entity => entity.comments, {onDelete: "SET NULL", nullable: true})
  parent: CommentedEntity;
}