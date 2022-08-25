import { Request } from 'express';
import { PairEntity } from 'src/pair/pair.entity';
import { ITradeOverall, TradeByBit } from 'src/interfaces/trade.interface';
const fs = require('fs');
import { IPair } from 'src/interfaces/pair.interface';
import { ITradeTransactionEntity, RecordEntityByBit } from 'src/interfaces/tradeTransaction.interface';

const restClientOptions = {
  recv_window: 4000
};


export const getToken = (req: Request) => {
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') { // Authorization: Bearer g1jipjgi1ifjioj
    // Handle token presented as a Bearer token in the Authorization header
    return req.headers.authorization.split(' ')[1];
  } else if (req.query && req.query.token) {
    // Handle token presented as URI param
    return req.query.token;
  } else if (req.cookies && req.cookies.token) {
    // Handle token presented as a cookie parameter
    return req.cookies.token;
  }
  // If we return null, we couldn't find a token.
  // In this case, the JWT middleware will return a 401 (unauthorized) to the client for this request
  return null;
};

export const arrayShuffle = (array: any[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};

export const generateRandomNumber = (from, to) => {
  return Math.floor(Math.random() * to) + from;
};

export const rollDice = count => {
  const res = [];
  for (let i = 0; i < count; i++) {
    res.push(generateRandomNumber(1, 6));
  }
  return res;
};

export const Timer = ({ value, onEnd, onTick, pause }) => {
  const data = {
    value,
    t: null,
    pause,
    onTick,
    onEnd
  };

  return {
    tick: function () {
      if (data.value > 0 && !data.pause) {
        data.t = setTimeout(() => {
          data.value -= 1;
          data.onTick(data.value);
          this.tick();
        }, 1000);
      } else {
        if (data.t && !data.pause) {
          data.onEnd()
        }
      }
    },
    set: function (args) {
      Object.keys(args).forEach(k => {
        data[k] = args[k];
      })
    },
    clear: function () {
      clearTimeout(data.t);
    },
    init: function (value) {
      clearTimeout(data.t);
      data.value = value;
      this.tick();
    }
  }
};


export const dataExpire = Number.isNaN(Number(process.env.DATA_EXPIRE)) ? 172800 : Number(process.env.DATA_EXPIRE);


export type GetDataFromBrokerProps = {
  dir: string,
  api_key: string,
  secret_key: string,
  url: string
  signature: string,
  pairs: PairEntity[]
}

export type LogItem = {
  pairId: string,
  
}

export const transformIntoTrade =(
  trade: TradeByBit,
  pair: IPair,
  authorId: string,
  brokerId: string
):Omit<ITradeOverall , 'id' | 'createdAt' | 'updatedAt'>  => ({
  pairId: pair.id,
  action: trade.side,
  openTradeTime: new Date(trade.created_at * 1000),
  closePrice: trade.avg_exit_price,
  openPrice: trade.order_price,
  order_id: trade.order_id,
  orderType: trade.order_type,
  leverage: trade.leverage,
  pnl: trade.closed_pnl,
  isManual: false,
  authorId,
  brokerId,
  execType: trade.exec_type,
  tags: [],
  notes: []
});

export const transformIntoTT =(
  order: RecordEntityByBit,
  pair: IPair,
  authorId: string,
  brokerId: string
):Omit<ITradeTransactionEntity , 'id' | 'createdAt' | 'updatedAt'>  => ({
  pairId: pair.id,
  authorId,
  brokerId,
  order_id: order.order_id,
  exec_id: order.exec_id,
  side: order.side,
  price: order.price,
  order_qty: order.order_qty,
  order_type: order.order_type,
  fee_rate: order.fee_rate,
  exec_price: order.exec_price,
  exec_type: order.exec_type,
  exec_qty: order.exec_qty,
  exec_fee: order.exec_fee,
  exec_value: order.exec_value,
  leaves_qty: order.leaves_qty,
  closed_size: order.closed_size,
  last_liquidity_ind: order.last_liquidity_ind,
  trade_time: new Date(order.trade_time * 1000),
})