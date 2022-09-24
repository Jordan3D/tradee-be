import {
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UpdateBody } from './dto/requests';
import { TagsService } from 'src/tags/tags.service';
import { QueryTypes } from 'sequelize';
import { TagsEntity } from 'src/models';
import { DiaryItemEntity } from './diaryItem.entity';
import { IDiaryItem, IDiaryItemFull, IDiaryItemOverall } from 'src/interfaces/diaryItem.interface';
import { format } from 'date-fns';
import { TagService } from 'src/tag';

@Injectable()
export class DiaryItemService {

  constructor(
    @InjectModel(DiaryItemEntity) private readonly rootModel: typeof DiaryItemEntity,
    @Inject(forwardRef(() => TagsService))
    private readonly tagsService: TagsService,
    @Inject(forwardRef(() => TagService))
    private readonly tagService: TagService
  ) { }

  async create(data: Omit<IDiaryItemOverall, 'id' | 'createdAt' | 'updatedAt' | 'settings'>): Promise<IDiaryItemOverall> {
    try {
      const dataToCreate = { ...data, author: { id: data.authorId } }
      const result = (await this.rootModel.create(dataToCreate)).toJSON();

      let tags = [] as string[];

      if (result && result.id && data.tags) {
        const tagsList = await this.tagsService.create({ tagIds: data.tags, parentId: result.id, parentType: 'journal' });
        tags = tagsList.map((tL: TagsEntity) => tL.tagId) || [];
      }

      return { ...result, tags };
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async getById(id: string, omit?: string[]): Promise<IDiaryItem | undefined> {
    try {
      const findedOne = await this.rootModel.findOne({
        where: { id },
        raw: true
      });

      const result = findedOne ? { ...findedOne, tags: [] } : undefined;

      if (findedOne.id) {
        result.tags = await this.tagsService.getByParentId(findedOne.id);
      }


      if (omit) {
        omit.forEach(o => {
          if (findedOne[o] !== undefined) {
            delete findedOne[o];
          }
        })
      }
      return result;

    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async delete(id: string): Promise<boolean> {
    const res = await this.rootModel.destroy({ where: { id } });

    return !!res;
  }

  async update(id: string, updates: Omit<UpdateBody, 'id' | 'createdAt' | 'updatedAt' | 'author'>): Promise<IDiaryItemOverall | undefined> {
    try {
      await this.rootModel.update(updates, { where: { id } });

      if (updates.tagsAdded) {
        await this.tagsService.create({ parentId: id, tagIds: updates.tagsAdded, parentType: 'journal' });
      }
      if (updates.tagsDeleted) {
        await this.tagsService.delete({ parentId: id, tagIds: updates.tagsDeleted });
      }
    } catch (error) {
      return error;
    }

    const one = await this.rootModel.findOne({
      where: { id },
      raw: true
    });

    return { ...one, tags: await this.tagsService.getByParentId(id) }
  }

  async findByDate(
    { startDate, endDate, authorId }:
      Readonly<{ startDate: number, endDate: number, authorId: string }>
  ): Promise<IDiaryItemFull[]> {

    let result: IDiaryItemFull[] = [];
    const list: IDiaryItemOverall[] = await this.rootModel.sequelize.query(
      `SELECT *  FROM "DiaryItem" item, LATERAL (
        SELECT ARRAY (
           SELECT "tagId"
           FROM   "Tags" tags
           WHERE  tags."parentId" = item.id
           ) AS tags
        ) t
      WHERE "authorId"='${authorId}'
      AND "createdAt" BETWEEN '${format(new Date(startDate * 1000), 'yyyy/MM/dd')}' AND '${format(new Date(endDate * 1000), 'yyyy/MM/dd')}'`
      , { type: QueryTypes.SELECT });

    result = await Promise.all(list.map(async item => {
      const itemResult = { ...item, tags: [], notes: [], pnls: [], transactions: [], ideas: [] } as IDiaryItemFull;
      itemResult.tags = await this.tagService.getByIds(item.tags);
      return itemResult;
    }));

    return result;
  }

  async findById(
    { id }:
      Readonly<{ id: string }>
  ): Promise<IDiaryItemOverall> {

    const list: IDiaryItemOverall[] = await this.rootModel.sequelize.query(
      `SELECT *  FROM "DiaryItem" item, LATERAL (
        SELECT ARRAY (
           SELECT "tagId"
           FROM   "Tags" tags
           WHERE  tags."parentId" = item.id
           ) AS tags
        ) t
      WHERE "id"='${id}'`
      , { type: QueryTypes.SELECT });

    return list.map(item => ({ ...item, tags: [], notes: [] })).length ? list[0] : undefined;
  }
}
