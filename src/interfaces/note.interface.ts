import { TagEntity, UserEntity } from 'src/model';
import {IBase} from './base.interface';

export interface INoteFull extends IBase{
  title: string;
  content: string;
  author: UserEntity;
  rating: number;
}

export interface INote extends IBase{
  title: string;
  content: string;
  author: string;
  rating: number;
}
