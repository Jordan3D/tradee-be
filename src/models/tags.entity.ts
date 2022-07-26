import { Table, Column, DataType, ForeignKey, Model} from 'sequelize-typescript';
import { TagEntity } from './tag.entity';

@Table({ modelName: 'tags' } )
export class TagsEntity extends Model{
  @Column({  type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
    primaryKey: true})
  id: string;

  @ForeignKey(() => TagEntity)
  tagId: string;

  @Column({type: DataType.UUID})
  parentId: string;

  @Column({ type: 'varchar'})
  parentType: 'note' | 'idea'
}