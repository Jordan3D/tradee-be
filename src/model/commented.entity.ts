import { Entity, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { CommentEntity } from './comment.entity';

@Entity({ name: 'commented' })
export class CommentedEntity extends BaseEntity {
  @OneToMany(() => CommentEntity, entity => entity.parent, {onDelete: "SET NULL", nullable: true})
  comments: CommentEntity[];
}