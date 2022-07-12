import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'tags' } )
export class TagsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  tagId: string;

  @Column('uuid')
  parentId: string;

  @Column({ type: 'varchar'})
  parentType: 'note' | 'idea'
}