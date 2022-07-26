import { ITag } from 'src/interfaces/tag.interface';

export class ResponseDto implements ITag {
  
  id: string;
  
  title: string;

  authorId: string;

  parentId: string;

  isMeta?: boolean;
  
  createdAt: Date;
  
  updatedAt: Date;

  level: number;

  constructor(tag: ITag) {
    Object.keys(tag).forEach(key => {
        this[key] = tag[key];
    })
  }
}