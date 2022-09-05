import { IBase } from "./base.interface";

export interface IFile extends IBase{
    key: string;
    url: string;
    authorId: string;
    parentId?: string;
    parentType?: 'idea'
  }