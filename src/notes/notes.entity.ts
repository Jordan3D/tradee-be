import { Table, Column, DataType, ForeignKey, Model, BelongsTo} from 'sequelize-typescript';
import { NoteEntity } from 'src/note/note.entity';

@Table({ modelName: 'Notes', freezeTableName: true })
export class NotesEntity extends Model{
  @Column({  type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
    primaryKey: true})
  id: string;

  @ForeignKey(() => NotesEntity)
  noteId: string;

  @BelongsTo(() => NoteEntity)
  note: NoteEntity

  @Column({type: DataType.UUID})
  parentId: string;

  @Column({ type: 'varchar'})
  parentType: 'trade' | 'idea'
}