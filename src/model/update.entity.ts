import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity({ name: 'update' })
export class UpdateEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 20, default: '' })
  name: string;
  
  @Column({type: "timestamp", nullable: true})
  dateStart!: Date;
  
  @Column({type: "timestamp", nullable: true})
  dateEnd!: Date;
  
  @Column({ type: 'varchar'})
  version: string;
  
  @Column({ type: 'varchar', nullable: true})
  descriptions: string;
}