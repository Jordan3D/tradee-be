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
  openPrice: number;

  @Column({  type: DataType.DATE  })
  openTradeTime: Date;

  @Column({ type: DataType.FLOAT })
  closePrice: number;

  @Column({  type: DataType.DATE  })
  closeTradeTime?: Date;

  @Column({ type: DataType.FLOAT })
  leverage: number;

  @Column({ type: DataType.FLOAT })
  pnl: number;

  @Column({ type: DataType.STRING})
  orderType: string;

  @Column({ type: DataType.STRING})
  execType: string;

  @Column({ type: DataType.STRING})
  order_id: string;

  @Column({ type: DataType.BOOLEAN })
  isManual: boolean;
}