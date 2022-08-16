import { Table, Column, DataType, ForeignKey, BelongsTo, Sequelize } from 'sequelize-typescript';
import { BrokerEntity } from 'src/broker/broker.entity';
import { PairEntity } from 'src/pair/pair.entity';
import { BaseEntity } from '../models/base.entity';
import { UserEntity } from '../user/user.entity';

@Table({ modelName: 'Trade', freezeTableName: true })
export class TradeEntity extends BaseEntity {
  @ForeignKey(() => PairEntity)
  pairId: string;

  @BelongsTo(() => PairEntity)
  pair: PairEntity;

  @ForeignKey(() => UserEntity)
  authorId: string;

  @BelongsTo(() => UserEntity)
  author: UserEntity;

  @ForeignKey(() => BrokerEntity)
  brokerId: string;

  @BelongsTo(() => BrokerEntity)
  broker: BrokerEntity;

  @Column({ type: DataType.STRING })
  action: string;

  @Column({ type: DataType.FLOAT })
  open: number;

  @Column({ defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"), })
  tradeTime: Date;

  @Column({ type: DataType.FLOAT })
  close: number;

  @Column({ type: DataType.FLOAT })
  leverage: number;

  @Column({ type: DataType.FLOAT })
  fee: number;

  @Column({ type: DataType.FLOAT })
  pnl: number;

  @Column({ type: DataType.STRING})
  orderType: string;

  @Column({ type: DataType.BOOLEAN })
  isManual: boolean;
}