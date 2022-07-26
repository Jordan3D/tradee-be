import {IBase} from './base.interface';
export interface ITag extends IBase{
  title: string;
  parentId: string | null;
  isMeta?: boolean;
  authorId: string;
  level: number;
}
