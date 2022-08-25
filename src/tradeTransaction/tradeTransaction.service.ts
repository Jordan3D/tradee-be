import {
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { TradeTransactionEntity } from './tradeTransaction.entity';
import { ITradeTransactionEntity } from 'src/interfaces/tradeTransaction.interface';
import { QueryTypes } from 'sequelize';

@Injectable()
export class TradeTransactionService {

  constructor(
    @InjectModel(TradeTransactionEntity) private readonly rootModel: typeof TradeTransactionEntity,
  ) { 
   
  }

  async createMultiple(data: Omit<ITradeTransactionEntity, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<ITradeTransactionEntity[]>{
    try {
      const result = await this.rootModel.bulkCreate(data);
      return result.map(item => item.toJSON())
    }catch(e){
      console.log(e);
    }
  }

  async delete(id: string): Promise<boolean> {
    const res = await this.rootModel.destroy({ where: { id } });

    return !!res;
  }

  async deleteAllByParent(authorId: string): Promise<boolean> {
    const res = await this.rootModel.destroy({ where: { authorId } });

    return !!res;
  }


  async findBy(
    { pairId, limit, offset, authorId, orderBy }:
      Readonly<{ pairId?: string, limit?: number, offset?: number, authorId: string, orderBy: string }>
  ): Promise<Readonly<{
    data: ITradeTransactionEntity[], total: number, offset: number, limit: number, orderBy: string
  }>> {
    const [_orderBy = 'tradeTime', direction = 'DESC'] = orderBy.split(',');
    
    const data = (await this.rootModel.sequelize.query(
      `SELECT *  FROM "TradeTransaction" trade,
        WHERE "authorId"='${authorId}' ${!pairId ? '' : 'AND "pairId"=\'' + pairId + '\''}
        ORDER BY "${_orderBy}" ${direction}
        ${limit ? 'LIMIT '+ limit : ''}
        ${offset ? 'OFFSET '+ offset : ''}
        `,
    { type: QueryTypes.SELECT }
    )) as ITradeTransactionEntity[];
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
