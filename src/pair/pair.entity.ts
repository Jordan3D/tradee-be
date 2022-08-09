import { Table, Column, DataType} from 'sequelize-typescript';
import { BaseEntity } from '../models/base.entity';

@Table({ modelName: 'Pair', freezeTableName: true })
export class PairEntity extends BaseEntity {
  @Column({ type: DataType.STRING})
  title: string;
}