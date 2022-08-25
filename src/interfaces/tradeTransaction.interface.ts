
export type ITradeTransactionEntity = Omit<RecordEntityByBit,'trade_time' | 'symbol'> & {
  pairId: string;
  authorId: string;
  brokerId: string;
  trade_time: Date;
} 

export type RecordEntityByBit = {
  order_id: string;
  exec_id: string;
  side: string;
  symbol: string;
  price: number;
  order_qty: number;
  order_type: string;
  fee_rate: number;
  exec_price: number;
  exec_type: string;
  exec_qty: number;
  exec_fee: number;
  exec_value: number;
  leaves_qty: number;
  closed_size: number;
  trade_time: number;
  last_liquidity_ind: string;
}