import { ITrade } from 'src/interfaces/trade.interface';

export class ResponseDto implements ITrade {
  
  id: string;

  pair: string;

  action: string;

  dateOpen: string;

  open: number;

  dateClose?: string;

  close?: number;

  fee?: number;

  authorId: string;

  tags: string[];

  notes: string[];
  
  createdAt: Date;
  
  updatedAt: Date;

  constructor(entity: ITrade) {
    Object.keys(entity).forEach(key => {
        this[key] = entity[key];
    })
  }
}