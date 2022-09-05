import {IBase} from './base.interface';
import { IFile } from './file.interface';
import { INote } from './note.interface';
import { ITag } from './tag.interface';

export interface IIdea extends IBase{
  title: string;
  content: string;
  authorId: string;
  photos: string[];
}

export interface ICreateIdea{
  title: string;
  content: string;
  authorId: string;
  tags: string[];
  notes: string[];
  photos: string[];
}

export interface IIdeaOverall extends Omit<IIdea, 'photos'>{
  tags: string[];
  notes: string[];
  photos: IFile[];
}

export interface IIdeaFull extends IBase{
  title: string;
  content: string;
  authorId: string;
  photos: IFile[];
  notes: INote[];
  tags: ITag[];
}