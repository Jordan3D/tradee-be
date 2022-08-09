import { Table, Column, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { PairEntity } from 'src/pair/pair.entity';
import { BaseEntity } from '../models/base.entity';
import { UserEntity } from '../user/user.entity';

@Table({ modelName: 'Trade', freezeTableName: true })
export class TradeEntity extends BaseEntity {
  @ForeignKey(() => PairEntity)
  pairId: string;

  @BelongsTo(() => PairEntity)
  pair: PairEntity

  @ForeignKey(() => UserEntity)
  authorId: string;

  @BelongsTo(() => UserEntity)
  author: UserEntity

  @Column({ type: DataType.STRING })
  action: string;

  @Column({ type: DataType.NUMBER })
  open: number;

  @Column({ type: DataType.DATE })
  dateOpen: string;

  @Column({ type: DataType.NUMBER })
  close: number;

  @Column({ type: DataType.DATE })
  dateClose: string;

  @Column({ type: DataType.NUMBER })
  fee: number;
}