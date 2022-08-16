const fs = require('fs');
var path = require('path');

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
import { BrokerLog, IBroker } from 'src/interfaces/broker.interface';
import { LinearClient } from 'bybit-api';
import { getUnixTime } from 'date-fns';
import { PairService } from 'src/pair';
import { IPair } from 'src/interfaces/pair.interface';
import { TradeService } from 'src/trade';
import { transformIntoTradeCreate } from 'src/util';
import { ITradeOverall } from 'src/interfaces/trade.interface';


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
    private readonly tradeService: TradeService
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
    const lastSync = one.lastSync ? JSON.parse(one.lastSync) : [];

    const processSync = async () => {
      const logs = await pairs.reduce<Promise<BrokerLog[]>>(async (memo: Promise<BrokerLog[]>, pair: IPair) => {
        const results = await memo;
        const v = await cycle(pair);
        return [...results, v];
      }, Promise.resolve([]));

       // update sync flag on finish
      await this.rootModel.update({isSyncing: false, lastSync: JSON.stringify(logs)}, { where: { id } });
      console.log(`Sync ${id} success`);
    }

    const cycle = async (pair: IPair): Promise<BrokerLog> =>{
      let page = 0;
      const sync = lastSync.find(pairSync => pairSync.pairId === pair.id);
    
      let data = [] as Omit<ITradeOverall, 'id' | 'createdAt' | 'updatedAt'>[];

      while (true) {
        page += 1;

        const { result } = await client.getClosedPnl({ symbol: pair.title, page, start_time: sync ? getUnixTime(sync.lastUpdated) : undefined});
        if (!result.data)
          break;

        data = data.concat(result.data.map(trade => transformIntoTradeCreate(trade, pair, authorId, id)));
      }

      await this.tradeService.createMultiple(data);

      return {
        lastUpdated: getUnixTime(new Date()) * 1000,
        pairId: pair.id
      }
    }

    // update sync flag on start
    await this.rootModel.update({isSyncing: true}, { where: { id } });
    console.log(`Sync ${id} start`);

    processSync();
    return true;
  }
}