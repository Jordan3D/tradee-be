import {IBase} from './base.interface';
import { INote } from './note.interface';
import { ITag } from './tag.interface';

export interface IIdeaSettings {
  color: string;
}

export interface IJournalItem extends IBase{
  title: string;
  content: string;
  authorId: string;
  pnls: string[];
  transactions: string[];
}

export interface IJournalItemOverall extends IJournalItem{
  tags: string[];
  notes: string[];
}

export interface IJournalItemFull extends IBase{
  title: string;
  content: string;
  authorId: string;
  tags: ITag[];
  notes: INote[];
  pnls: string[];
  transactions: string[];
}