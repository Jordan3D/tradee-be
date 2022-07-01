import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity({ name: 'item' })
export class ItemEntity extends BaseEntity {
  @Column({ type: 'varchar' })
  name: string;
  
  @Column({ type: 'jsonb' })
  info?: object;
  
  @Column({ type: 'int', default: () => 0 })
  cost: number;
  
  @Column({ type: 'boolean'})
  canBeOwned: boolean;

  @Column({ type: 'boolean', default: () => false})
  canBeUpgraded: boolean;
  
  @Column({ type: 'boolean'})
  canBeMortgaged: boolean;
  
  @Column({ type: 'jsonb'})
  additional?: {[keys: string]: string};
}