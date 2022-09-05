import { IIdea } from 'src/interfaces/idea.interface';
import { INote } from 'src/interfaces/note.interface';

export class ResponseDto implements IIdea {
  
  id: string;

  title: string;

  content: string;

  authorId: string;

  tags: string[];

  notes: string[];

  photos: string[];
  
  createdAt: Date;
  
  updatedAt: Date;

  constructor(entity: IIdea) {
    Object.keys(entity).forEach(key => {
        this[key] = entity[key];
    })
  }
}

export class UploadedPhotoDto {
  key: string;
  url: string;
}