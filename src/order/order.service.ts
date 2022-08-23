import {
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { TagsService } from 'src/tags/tags.service';
import { QueryTypes } from 'sequelize';
import { TagsEntity } from 'src/models';
import { ITradeOverall } from 'src/interfaces/trade.interface';
import { OrderEntity } from './order.entity';
import { IOrder } from 'src/interfaces/order.interface copy';

@Injectable()
export class OrderService {

  constructor(
    @InjectModel(OrderEntity) private readonly rootModel: typeof OrderEntity,
  ) { 
   
  }

  async createMultiple(data: Omit<IOrder, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<IOrder[]>{
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

  async findBy(
    { pairId, limit, offset, authorId, orderBy }:
      Readonly<{ pairId?: string, limit?: number, offset?: number, authorId: string, orderBy: string }>
  ): Promise<Readonly<{
    data: ITradeOverall[], total: number, offset: number, limit: number, orderBy: string
  }>> {
    const [_orderBy = 'tradeTime', direction = 'DESC'] = orderBy.split(',');
    
    const data = (await this.rootModel.sequelize.query(
      `SELECT *  FROM "Trade" trade,
        LATERAL (
           SELECT ARRAY (
            SELECT "tagId"
            FROM   "Tags" tags
            WHERE  tags."parentId" = trade.id
              ) AS tags
           ) t,
           LATERAL (
            SELECT ARRAY (
               SELECT "noteId"
               FROM   "Notes" notes
               WHERE  notes."parentId" = trade.id
               ) AS notes
            ) n
        WHERE "authorId"='${authorId}' ${!pairId ? '' : 'AND "pairId"=\'' + pairId + '\''}
        ORDER BY "${_orderBy}" ${direction}
        ${limit ? 'LIMIT '+ limit : ''}
        ${offset ? 'OFFSET '+ offset : ''}
        `,
      { type: QueryTypes.SELECT }
    )) as ITradeOverall[];
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
