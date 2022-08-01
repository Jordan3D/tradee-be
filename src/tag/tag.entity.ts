import { Table, Column, DataType, ForeignKey, BelongsTo, BelongsToMany, HasMany} from 'sequelize-typescript';
import { BaseEntity } from '../models/base.entity';
import { UserEntity } from '../user/user.entity';


@Table({ modelName: 'Tag', freezeTableName: true })
export class TagEntity extends BaseEntity {
  @Column({ type: DataType.STRING})
  title: string;

  @ForeignKey(()=>TagEntity)
  parentId: string;

  @BelongsTo(() => TagEntity)
  parent: TagEntity;

  @Column({ type: DataType.BOOLEAN})
  isMeta?: boolean;

  @BelongsTo(() => UserEntity)
  author: UserEntity;

  @ForeignKey(() => UserEntity)
  authorId: string;

  @Column({type: DataType.INTEGER})
  level: number
}