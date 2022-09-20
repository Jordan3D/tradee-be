import {IBase} from './base.interface';
import { IFile } from './file.interface';
import { INote } from './note.interface';
import { ITag } from './tag.interface';

export interface IIdea extends IBase{
  title: string;
  content: string;
  authorId: string;
  images: string[];
}

export interface ICreateIdea{
  title: string;
  content: string;
  authorId: string;
  tags: string[];
  notes: string[];
  images: string[];
}

export interface IIdeaOverall extends Omit<IIdea, 'images'>{
  tags: string[];
  notes: string[];
  images: IFile[];
}

export interface IIdeaFull extends IBase{
  title: string;
  content: string;
  authorId: string;
  images: IFile[];
  notes: INote[];
  tags: ITag[];
}