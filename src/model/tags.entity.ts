import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToOne, OneToMany } from 'typeorm';
import { TagEntity } from './tag.entity';

@Entity({ name: 'tags' } )
export class TagsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(()=>TagEntity, entity => entity.id, {onDelete: 'CASCADE'})
  tag: TagEntity | string;

  @Column('uuid')
  parentId: string;

  @Column({ type: 'varchar'})
  parentType: 'note' | 'idea'
}