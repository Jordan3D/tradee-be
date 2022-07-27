import { Table, Column, DataType, ForeignKey } from 'sequelize-typescript';
import { BaseEntity } from './base.entity';
import { UserEntity } from '../user/user.entity';

@Table({ modelName: 'Note', freezeTableName: true })
export class NoteEntity extends BaseEntity {
  @Column({ type: DataType.STRING})
  title: string;

  @Column({ type: DataType.STRING })
  content: string;

  @ForeignKey(() => UserEntity)
  authorId: string;

  @Column({ type: DataType.NUMBER})
  rating: number
}