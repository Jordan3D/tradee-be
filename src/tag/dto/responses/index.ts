import { ITag, ITagFull } from 'src/interfaces/tag.interface';
import { TagEntity, UserEntity } from '../../../model';

export class TagResponseDto implements TagEntity {
  
  id: string;
  
  title: string;

  owner: UserEntity;

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