import { Column, DataType, Model } from 'sequelize-typescript';

export abstract class BaseEntity extends Model {
  @Column({  type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
    primaryKey: true})
  id: string;
  
  @Column({type: DataType.TIME})
  createdAt: Date;
  
  @Column({type: DataType.TIME})
  updatedAt: Date;
}