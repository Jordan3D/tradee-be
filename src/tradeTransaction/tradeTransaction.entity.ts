import { Table, Column, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { BaseEntity, UserEntity } from 'src/models';

@Table({ modelName: 'TradeTransaction', freezeTableName: true })
export class TradeTransactionEntity extends BaseEntity {
  @Column({  type: DataType.STRING })
  order_id: string;

  @Column({  type: DataType.STRING  })
  exec_id: string;

  @ForeignKey(() => UserEntity)
  authorId: string;

  @BelongsTo(() => UserEntity)
  author: UserEntity;

  @Column({  type: DataType.STRING  })
  side: string;

  @Column({  type: DataType.STRING  })
  symbol: string;

  @Column({  type: DataType.FLOAT  })
  price: number;

  @Column({  type: DataType.FLOAT  })
  order_qty: number;

  @Column({  type: DataType.STRING  })
  order_type: string;

  @Column({  type: DataType.FLOAT  })
  fee_rate: number;

  @Column({  type: DataType.FLOAT  })
  exec_price: number;

  @Column({  type: DataType.STRING  })
  exec_type: string;

  @Column({  type: DataType.FLOAT  })
  exec_qty: number;

  @Column({  type: DataType.FLOAT  })
  exec_fee: number;

  @Column({  type: DataType.FLOAT  })
  exec_value: number;

  @Column({  type: DataType.FLOAT  })
  leaves_qty: number;

  @Column({  type: DataType.FLOAT  })
  closed_size: number;

  @Column({  type: DataType.STRING  })
  last_liquidity_ind: string;

  @Column({  type: DataType.DATE  })
  trade_time: Date;
}