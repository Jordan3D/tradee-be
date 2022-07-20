import { ITagFull } from 'src/interfaces/tag.interface';
import { TagEntity, UserEntity } from '../../../model';

export class ResponseDto implements TagEntity {
  
  id: string;
  
  title: string;

  author: UserEntity;

  parent: TagEntity;

  children: TagEntity[];

  isMeta?: boolean;
  
  createdAt: Date;
  
  updatedAt: Date;

  level: number;

  constructor(tag: ITagFull) {
    Object.keys(tag).forEach(key => {
        this[key] = tag[key];
    })
  }
}