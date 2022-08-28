
import {
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UpdateBody } from './dto/requests';
import { TagsService } from 'src/tags/tags.service';
import { NotesService } from 'src/notes';
import { BrokerEntity } from './broker.entity';
import { IBroker, TLastSync } from 'src/interfaces/broker.interface';
import { LinearClient } from 'bybit-api';
import { PairService } from 'src/pair';
import { IPair } from 'src/interfaces/pair.interface';
import { TradeService } from 'src/trade';
import { transformIntoTrade, transformIntoTT } from 'src/util';
import { ITradeOverall } from 'src/interfaces/trade.interface';
import { TradeTransactionService } from 'src/tradeTransaction/tradeTransaction.service';
import { ITradeTransaction } from 'src/interfaces/tradeTransaction.interface';

const defaultSync = {pnl: {}, tradeTransactions: {}};

@Injectable()
export class BrokerService {

  constructor(
    @InjectModel(BrokerEntity) private readonly rootModel: typeof BrokerEntity,
    @Inject(forwardRef(() => TagsService))
    private readonly tagsService: TagsService,
    @Inject(forwardRef(() => NotesService))
    private readonly notesService: NotesService,
    @Inject(forwardRef(() => PairService))
    private readonly pairService: PairService,
    @Inject(forwardRef(() => TradeService))
    private readonly tradeService: TradeService,
    @Inject(forwardRef(() => TradeTransactionService))
    private readonly tradeTransactionService: TradeTransactionService
  ) { }

  async create(data: Omit<IBroker, 'id' | 'createdAt' | 'updatedAt' | 'isSyncing' | 'lastSync'>): Promise<IBroker> {
    const dataToCreate = { ...data, author: { id: data.authorId }, isSyncing: false }
    let result;
    try {
      result = await this.rootModel.create(dataToCreate);
    } catch (e){
      console.log(e);
    }
    return (result).toJSON();
  }

  async getById(id: string, omit?: string[]): Promise<IBroker | undefined> {
    const findedOne = await this.rootModel.findOne({
      where: { id },
      raw: true
    });


    if (omit) {
      omit.forEach(o => {
        if (findedOne[o] !== undefined) {
          delete findedOne[o];
        }
      })
    }

    return findedOne;
  }

  async delete(id: string): Promise<boolean> {
    const res = await this.rootModel.destroy({ where: { id } });

    return !!res;
  }

  async update(id: string, updates: Omit<UpdateBody, 'id' | 'createdAt' | 'updatedAt' | 'author' | 'lastSync' | 'isSyncing'>): Promise<IBroker | undefined> {
    try {
      await this.rootModel.update(updates, { where: { id } });
    } catch (error) {
      return error;
    }

    const one = await this.rootModel.findOne({
      where: { id },
      raw: true
    });

    return one;
  }

  async list(authorId: string): Promise<IBroker[]> {
    return this.rootModel.findAll(
      { where: { authorId }, raw: true }
    )
  }

  async clearSync(id: string, authorId: string): Promise<boolean> {
    const one = await this.rootModel.findOne({where: {id}, raw: true});
    if(!one || one.authorId !== authorId){
      return false;
    }

    try {
      await this.rootModel.update({isSyncing: false, lastSync: JSON.stringify(defaultSync)}, { where: { id } });
      await this.tradeService.deleteAllByParent(authorId);
      await this.tradeTransactionService.deleteAllByParent(authorId);
    } catch (e){
      throw e;
    }

    return true;
  }

  async sync(id: string, authorId: string): Promise<boolean> {
    const one = await this.rootModel.findOne({where: {id}, raw: true});

    if(!one || one.authorId !== authorId){
      return false;
    }

    const config = {
      url: 'https://api.bybit.com',
      signature: '11a4b5a44c99e87707a9fb3eac61475c20f08097bc72c3da47134fa3e6120594'
    }

    const restClientOptions = {
      recv_window: 4000
    };

    const useLivenet = true;

    const client = new LinearClient(
      one.api_key,
      one.secret_key,
      useLivenet,
      restClientOptions
    );

    const pairs = await this.pairService.findAll();
    const lastSync : TLastSync = one.lastSync ? JSON.parse(one.lastSync) : defaultSync;

    const processSync = async () => {
      await pairs.reduce<Promise<boolean[]>>(async (memo: Promise<boolean[]>, pair: IPair) => {
        const results = await memo;
        const v = await cycle(pair);
        return [...results, v];
      }, Promise.resolve([]));

       // update sync flag on finish
      await this.rootModel.update({isSyncing: false, lastSync: JSON.stringify(lastSync)}, { where: { id } });
      console.log(`Sync ${id} success`);
    }

    const cycle = async (pair: IPair): Promise<boolean> =>{
      let page = 0;
      const syncPnl = lastSync.pnl[pair.title] ? lastSync.pnl[pair.title] : undefined;
      const syncTransactions= lastSync.tradeTransactions[pair.title] ? lastSync.tradeTransactions[pair.title] : undefined;
    
      let data = {pnl: [] as Omit<ITradeOverall, 'id' | 'createdAt' | 'updatedAt'>[] , tradeTransactions: [] as Omit<ITradeTransaction, 'id' | 'createdAt' | 'updatedAt'>[]}

      while (true) {
        page += 1;

        const { result } = await client.getClosedPnl({ symbol: pair.title, page, start_time: syncPnl});
        if (!result?.data)
          break;

        data.pnl = data.pnl.concat(result.data.map(trade => transformIntoTrade(trade, pair, authorId, id)));

        // setting sync date by saving last trade date
        if(result.data.length && page === 1){
          lastSync.pnl[pair.title] = result.data[0].created_at + 1;
        }
      }

      page = 0;

      while (true) {
        page += 1;

        const { result } = await client.getTradeRecords({ symbol: pair.title, page, start_time: syncTransactions});
        
        if (!result?.data)
          break;

        data.tradeTransactions = data.tradeTransactions.concat(result.data.map(trade => transformIntoTT(trade, pair, authorId, id)));

        // setting sync date by saving last trade date
        if(result.data.length && page === 1){
          lastSync.tradeTransactions[pair.title] = result.data[0].trade_time  + 1;
        }
      }

      // adding missing data to pnl trades from order history
      data.pnl = data.pnl.map(trade => {
        const order = data.tradeTransactions.find(order => order.order_id === trade.order_id);

        return {
          ...trade,
          closeTradeTime: order.trade_time
        }
      })
      //


      await this.tradeService.createMultiple(data.pnl);
      await this.tradeTransactionService.createMultiple(data.tradeTransactions);

      return true;
    }

    // update sync flag on start
    await this.rootModel.update({isSyncing: true}, { where: { id } });
    console.log(`Sync ${id} start`);

    processSync();
    return true;
  }
}