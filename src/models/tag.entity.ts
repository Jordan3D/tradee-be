import { Table, Column, DataType, ForeignKey} from 'sequelize-typescript';
import { BaseEntity } from './base.entity';
import { UserEntity } from './user.entity';


@Table({ modelName: 'tag' })
export class TagEntity extends BaseEntity {
  @Column({ type: DataType.STRING})
  title: string;

  @ForeignKey(()=>TagEntity)
  parentId: string;

  @Column({ type: DataType.BOOLEAN})
  isMeta?: boolean;

  @ForeignKey(() => UserEntity)
  authorId: string;

  @Column({type: DataType.INTEGER})
  level: number
}