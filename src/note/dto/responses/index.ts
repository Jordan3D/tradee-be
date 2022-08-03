import { INote } from 'src/interfaces/note.interface';
import { ITag } from 'src/interfaces/tag.interface';
import { UserEntity } from 'src/models';
import { NoteEntity } from 'src/note/note.entity';

export class ResponseDto implements INote {
  
  id: string;

  title: string;

  content: string;

  authorId: string;

  settings: any;

  tags: string[];

  rating: number;
  
  createdAt: Date;
  
  updatedAt: Date;

  constructor(entity: INote) {
    Object.keys(entity).forEach(key => {
        this[key] = entity[key];
    })
  }
}