import { Entity, Column, ManyToOne, ManyToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { TagEntity } from './tag.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'idea' })
export class IdeaEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 56, default: '' })
  title: string;

  @Column({ type: 'varchar', length: 400, default: '' })
  content: string;

  @ManyToMany(() => TagEntity, entity => entity.id)
  tags: TagEntity[]

  @ManyToOne(() => UserEntity, entity => entity.id, {onDelete: 'NO ACTION', nullable: false})
  author: UserEntity;

  @Column({ type: 'integer', default: 0})
  rating: number
}