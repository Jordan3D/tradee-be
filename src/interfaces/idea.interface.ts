import {IBase} from './base.interface';
import { IComment } from './comment.interface';
import { ITag } from './tag.interface';

export interface IIdeaSettings {
  color: string;
}

export interface IIdea extends IBase{
  title: string;
  content: string;
  authorId: string;
}

export interface IIdeaOverall extends IIdea{
  tags: string[];
  // comments: string[];
}

export interface IIdeaFull extends IBase{
  title: string;
  content: string;
  authorId: string;
  rating: number;
  comments: IComment[];
  tags: ITag[];
}