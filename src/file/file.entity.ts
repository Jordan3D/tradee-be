import { Table, Column, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { UserEntity } from 'src/models';
import { BaseEntity } from '../models/base.entity';

@Table({ modelName: 'File', freezeTableName: true })
export class FileEntity extends BaseEntity {
  @Column({ type: DataType.STRING})
  key: string;

  @Column({ type: DataType.STRING })
  url: string;

  @ForeignKey(() => UserEntity)
  authorId: string;

  @BelongsTo(() => UserEntity)
  author: UserEntity;

  @Column({type: DataType.UUID})
  parentId?: string;

  @Column({ type: 'varchar'})
  parentType?: 'idea'
}