import { TagEntity, UserEntity } from 'src/model';
import {IBase} from './base.interface';

export interface ITagFull extends IBase{
  title: string;
  parent?: TagEntity;
  children?: TagEntity[];
  isMeta?: boolean;
  author: UserEntity;
}

export interface ITag extends IBase{
  title: string;
  parent?: string;
  children?:  TagEntity[];
  isMeta?: boolean;
  author: string;
}
