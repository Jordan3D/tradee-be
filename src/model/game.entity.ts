import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';
import { defaultGameSettings } from '../game/game.constants';
import GameSettings from '../game/settings';

@Entity({ name: 'game' })
export class GameEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 20, default: 'game' })
  name: string;
  
  @Column({ type: 'boolean', default: false })
  isPrivate: boolean;
  
  @Column({ type: 'varchar', length: 20, default: '' })
  password: string;
  
  @Column({ type: 'varchar', length: 20, default: 'new' })
  phase: string;
  
  @Column({ type: 'varchar', length: 20, default: '' })
  subphase: string;
  
  @Column({ type: 'varchar'})
  service: string;
  
  @Column({ type: 'jsonb', nullable: true })
  players;
  
  @Column({ type: 'jsonb', nullable: true})
  settings;
}