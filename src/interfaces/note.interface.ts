import {IBase} from './base.interface';
import { ITag } from './tag.interface';

export interface INoteSettings {
  color: string;
}

export interface INoteOverall extends INote{
  tags: string[];
}

export interface INoteFull extends IBase{
  title: string;
  content: string;
  authorId: string;
  settings: INoteSettings[];
  tags: ITag[];
}
export interface INote extends IBase{
  title: string;
  content: string;
  authorId: string;
  settings: INoteSettings[];
}