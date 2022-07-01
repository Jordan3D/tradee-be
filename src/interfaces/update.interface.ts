import { IBase } from './base.interface';

export interface IUpdate extends IBase{
  name: string;
  dateStart: Date;
  dateEnd: Date;
  version: string;
  descriptions: string;
}
