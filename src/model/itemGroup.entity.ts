import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity({ name: 'item_group' })
export class ItemGroupEntity extends BaseEntity {
  @Column({ type: 'varchar', default: '000000' })
  color: string;
  @Column({ type: 'varchar', default: 'defaultName' })
  name: string;
}