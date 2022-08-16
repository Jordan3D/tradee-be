import { Table, Column, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { UserEntity } from 'src/models';
import { BaseEntity } from '../models/base.entity';

@Table({ modelName: 'Broker', freezeTableName: true })
export class BrokerEntity extends BaseEntity {
  @Column({ type: DataType.STRING})
  title: string;

  @Column({ type: DataType.STRING})
  api_key: string;

  @Column({ type: DataType.STRING})
  secret_key: string;

  @ForeignKey(() => UserEntity)
  authorId: string;

  @BelongsTo(() => UserEntity)
  author: UserEntity

  @Column({ type: DataType.STRING})
  broker_type: string;

  @Column({ type: DataType.BOOLEAN})
  isSyncing: boolean;

  @Column({ type: DataType.JSONB})
  lastSync: any;
}