import { IIdea } from 'src/interfaces/idea.interface';

export class ResponseDto implements IIdea {
  
  id: string;

  title: string;

  content: string;

  authorId: string;

  settings: any;

  tags: string[];

  comments: string[];

  rating: number;
  
  createdAt: Date;
  
  updatedAt: Date;

  constructor(entity: IIdea) {
    Object.keys(entity).forEach(key => {
        this[key] = entity[key];
    })
  }
}