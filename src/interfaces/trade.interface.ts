import {IBase} from './base.interface';

export interface ITrade extends IBase{
  pairId: string;
  action: string;
  dateOpen: string;
  open: number;
  dateClose?: string;
  close?: number;
  fee?: number;
  authorId: string;
}

export interface ITradeOverall extends ITrade{
  tags: string[];
  notes: string[];
}
