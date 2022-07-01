import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';
import { IsArray } from 'class-validator';

@Entity({ name: 'game_map' })
export class GameMapEntity extends BaseEntity {
  @Column({ type: 'varchar' })
  name: string;
  
  @Column("text", { array: true, default: {}, nullable: false})
  steps: string[];
  
  @Column("text", { array: true, default: {}, nullable: false})
  lotteries: string[];
  
  @Column("text", { array: true, default: {}, nullable: false})
  chances: string[];
}