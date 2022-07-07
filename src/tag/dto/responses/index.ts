import { ITagFull } from 'src/interfaces/tag.interface';
import { TagEntity, UserEntity } from '../../../model';

export class ResponseDto implements TagEntity {
  
  id: string;
  
  title: string;

  author: UserEntity;

  parent: TagEntity;

  children: TagEntity[];

  isMeta: boolean;
  
  isDeleted: boolean;
  
  createdAt: Date;
  
  updatedAt: Date;

  constructor(tag: ITagFull) {
    Object.keys(tag).forEach(key => {
        this[key] = tag[key];
    })
  }
}