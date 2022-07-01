import { PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn } from 'typeorm';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  
  @Column({ type: 'boolean', default: false })
  isDeleted: boolean;
  
  @Column({type: "timestamp", default: () => 'CURRENT_TIMESTAMP'})
  createdAt: Date;
  
  @Column({type: "timestamp", default: () => 'CURRENT_TIMESTAMP'})
  updatedAt: Date;
}