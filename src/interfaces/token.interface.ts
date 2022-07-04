import { IBase } from './base.interface';

export interface IToken extends IBase{
  tokenId: string;
  userId: string;
}
