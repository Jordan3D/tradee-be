import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'tag' })
export class TagEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 56, default: '' })
  title: string;
  
  @ManyToOne(() => TagEntity, tag => tag.children, {onDelete: "SET NULL", nullable: true})
  parent: TagEntity;
  
  @OneToMany(() => TagEntity, tag => tag.parent)
  children: TagEntity[];

  @Column({ type: 'boolean', default: false })
  isMeta: boolean;

  @ManyToOne(() => UserEntity, user => user.id, {onDelete: 'NO ACTION', nullable: false})
  author: UserEntity;
}