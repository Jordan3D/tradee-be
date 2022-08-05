import { Table, Column, DataType, ForeignKey, Model, BelongsTo} from 'sequelize-typescript';
import { TagEntity } from '../tag/tag.entity';

@Table({ modelName: 'Tags', freezeTableName: true } )
export class TagsEntity extends Model{
  @Column({  type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
    primaryKey: true})
  id: string;

  @ForeignKey(() => TagEntity)
  tagId: string;

  @BelongsTo(() => TagEntity)
  tag: TagEntity

  @Column({type: DataType.UUID})
  parentId: string;

  @Column({ type: 'varchar'})
  parentType: 'note' | 'idea'
}