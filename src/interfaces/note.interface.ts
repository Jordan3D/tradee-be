import {IBase} from './base.interface';

export interface INote extends IBase{
  title: string;
  content: string;
  authorId: string;
  rating: number;
  tags: string[];
}
