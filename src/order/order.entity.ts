import { Table, Column, DataType, Model } from 'sequelize-typescript';
import { BaseEntity } from 'src/models';

@Table({ modelName: 'Order', freezeTableName: true })
export class OrderEntity extends BaseEntity {
  @Column({  type: DataType.STRING })
  order_id: string;

  @Column({  type: DataType.STRING  })
  exec_id: string;

  @Column({  type: DataType.STRING  })
  side: string;

  @Column({  type: DataType.STRING  })
  symbol: string;

  @Column({  type: DataType.FLOAT  })
  price: number;

  @Column({  type: DataType.FLOAT  })
  qty: number;

  @Column({  type: DataType.FLOAT  })
  fee_rate: number;

  @Column({  type: DataType.STRING  })
  order_type: string;

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

  @Column({  type: DataType.STRING  })
  last_liquidity_ind: string;

  @Column({  type: DataType.FLOAT  })
  closed_size: number;

  @Column({  type: DataType.DATE  })
  trade_time: Date;
}