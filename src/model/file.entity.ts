import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity({ name: 'file' })
export class FileEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 256, default: '' })
  key: string;
  
  @Column({ type: 'varchar', length: 256, default: ''})
  url: string;
}