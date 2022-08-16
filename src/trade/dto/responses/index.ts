import { ITrade } from 'src/interfaces/trade.interface';

export class ResponseDto implements ITrade {
  
  id: string;

  pairId: string;

  action: string;

  tradeTime: Date;

  open: number;

  close?: number;

  fee?: number;

  authorId: string;

  brokerId?: string;

  tags: string[];

  notes: string[];
  
  createdAt: Date;
  
  updatedAt: Date;

  leverage : number;

  pnl: number;

  orderType: string;

  isManual: boolean;

  constructor(entity: ITrade) {
    Object.keys(entity).forEach(key => {
        this[key] = entity[key];
    })
  }
}