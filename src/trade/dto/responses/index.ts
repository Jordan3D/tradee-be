import { ITrade } from 'src/interfaces/trade.interface';

export class ResponseDto implements ITrade {
  
  id: string;

  pairId: string;

  action: string;

  openTradeTime: Date;

  openPrice: number;

  closePrice?: number;
  
  closeTradeTime: Date;

  authorId: string;

  brokerId?: string;

  tags: string[];

  notes: string[];
  
  createdAt: Date;
  
  updatedAt: Date;

  leverage : number;

  pnl: number;

  orderType: string;
  
  execType: string;

  order_id: string;

  isManual: boolean;

  constructor(entity: ITrade) {
    Object.keys(entity).forEach(key => {
        this[key] = entity[key];
    })
  }
}