import {
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { TradeTransactionEntity } from './tradeTransaction.entity';
import { ITradeTransaction } from 'src/interfaces/tradeTransaction.interface';
import { Op, QueryTypes } from 'sequelize';

@Injectable()
export class TradeTransactionService {

  constructor(
    @InjectModel(TradeTransactionEntity) private readonly rootModel: typeof TradeTransactionEntity,
  ) { 
   
  }

  async createMultiple(data: Omit<ITradeTransaction, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<ITradeTransaction[]>{
    try {
      const result = await this.rootModel.bulkCreate(data);
      return result.map(item => item.toJSON())
    }catch(e){
      console.log(e);
    }
  }

  async deleteAllByParent(authorId: string): Promise<boolean> {
    const res = await this.rootModel.destroy({ where: { authorId } });

    return !!res;
  }

  async getByIds(ids: string[]): Promise<ITradeTransaction[] | undefined> {
    const result = await this.rootModel.findAll({
      where: {id: {
        [Op.in]: ids,
      },},
      raw: true
    });
    
    return result;
  }

  async findBy(
    { pairId, limit, offset, authorId, orderBy }:
      Readonly<{ pairId?: string, limit?: number, offset?: number, authorId: string, orderBy: string }>
  ): Promise<Readonly<{
    data: ITradeTransaction[], total: number, offset: number, limit: number, orderBy: string
  }>> {
    const [_orderBy = 'trade-time', direction = 'DESC'] = orderBy.split(',');
    
    const data = (await this.rootModel.sequelize.query(
      `SELECT *  FROM "TradeTransaction" trade
        WHERE "authorId"='${authorId}' ${!pairId ? '' : 'AND "pairId"=\'' + pairId + '\''}
        ORDER BY "${_orderBy}" ${direction}
        ${limit ? 'LIMIT '+ limit : ''}
        ${offset ? 'OFFSET '+ offset : ''}
        `,
    { type: QueryTypes.SELECT }
    )) as ITradeTransaction[];
    const total = await this.rootModel.count({where:{authorId}});

    return {
      data,
      total,
      offset,
      limit,
      orderBy
    }
  }
}
