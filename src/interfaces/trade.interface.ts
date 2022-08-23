import {IBase} from './base.interface';

export interface ITrade extends IBase{
  pairId: string;
  action: string;
  openPrice: number;
  openTradeTime: Date;
  closeTradeTime?: Date;
  closePrice?: number;
  leverage: number;
  pnl: number;
  order_id: string;
  authorId: string;
  brokerId?: string;
  orderType: string;
  execType: string;
  isManual: boolean;
}

export interface ITradeOverall extends ITrade{
  tags: string[];
  notes: string[];
}

export type TradeByBit = {
  id: number,
  user_id: number,
  symbol: string,
  order_id: string,
  side: string,
  qty: number,
  order_price: number,
  order_type: string,
  exec_type: string,
  closed_size: number,
  cum_entry_value: number,
  avg_entry_price: number,
  cum_exit_value: number,
  avg_exit_price: number,
  closed_pnl: number,
  fill_count: number,
  leverage: number,
  created_at: number
}