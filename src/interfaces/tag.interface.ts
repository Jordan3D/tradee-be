import { TagEntity, UserEntity } from 'src/model';
import {IBase} from './base.interface';

export interface ITagFull extends IBase{
  title: string;
  parent: TagEntity | null;
  children: TagEntity[];
  isMeta?: boolean;
  author: UserEntity;
  level: number;
}

export interface ITag extends IBase{
  title: string;
  parent: string | null;
  children:  TagEntity[];
  isMeta?: boolean;
  author: string;
  level: number;
}
