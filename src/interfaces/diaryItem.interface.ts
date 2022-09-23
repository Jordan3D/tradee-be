import {IBase} from './base.interface';
import { ITag } from './tag.interface';
export interface IDiaryItem extends IBase{
  title: string;
  content: string;
  authorId: string;
}

export interface IDiaryItemOverall extends IDiaryItem{
  tags: string[];
}

export interface IDiaryItemFull extends IBase{
  title: string;
  content: string;
  authorId: string;
  tags: ITag[];
}