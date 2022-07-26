import { INote } from 'src/interfaces/note.interface';
import { UserEntity } from 'src/models';

export class ResponseDto implements INote {
  
  id: string;

  title: string;

  content: string;

  authorId: string;

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