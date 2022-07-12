import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'note' })
export class NoteEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 56, default: '' })
  title: string;

  @Column({ type: 'varchar', length: 400, default: '' })
  content: string;

  @ManyToOne(() => UserEntity, entity => entity.id, {onDelete: 'NO ACTION', nullable: false})
  author: UserEntity;

  @Column({ type: 'integer', default: 0})
  rating: number
}