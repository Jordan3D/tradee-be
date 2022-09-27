import {
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UpdateBody } from './dto/requests';
import { IdeaEntity } from './idea.entity';
import { TagsService } from 'src/tags/tags.service';
import { Op, QueryTypes } from 'sequelize';
import { TagsEntity } from 'src/models';
import { NotesService } from 'src/notes';
import { ICreateIdea, IIdea, IIdeaOverall } from 'src/interfaces/idea.interface';
import { NotesEntity } from 'src/notes/notes.entity';
import { IFile } from 'src/interfaces/file.interface';
import { FileService } from 'src/file/file.service';

@Injectable()
export class IdeaService {

  constructor(
    @InjectModel(IdeaEntity) private readonly rootModel: typeof IdeaEntity,
    @Inject(forwardRef(() => TagsService))
    private readonly tagsService: TagsService,
    @Inject(forwardRef(() => NotesService))
    private readonly notesService: NotesService,
    @Inject(forwardRef(() => FileService))
    private readonly fileService: FileService,
  ) { }

  async create(data: ICreateIdea): Promise<IIdeaOverall> {
    const dataToCreate = { ...data, author: { id: data.authorId } }
    const result = (await this.rootModel.create(dataToCreate)).toJSON();

    let tags = [] as string[];
    let notes = [] as string[];

    if (result && result.id && data.tags) {
      const list = await this.tagsService.create({ tagIds: data.tags, parentId: result.id, parentType: 'idea' });
      tags = list.map((tL: TagsEntity) => tL.tagId) || [];
    }

    if (result && result.id && data.notes) {
      const list = await this.notesService.create({ noteIds: data.notes, parentId: result.id, parentType: 'idea' });
      notes = list.map((l: NotesEntity) => l.noteId) || [];
    }

    return { ...result, tags, notes };
  }

  async getById(id: string, omit?: string[]): Promise<IIdea | undefined> {
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
  }

  async getByIds(ids: string[]): Promise<IIdea[] | undefined> {
    const result = await this.rootModel.findAll({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
      raw: true
    });

    return result;
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.notesService.delete({ parentId: id });
      await this.tagsService.delete({ parentId: id });
      await this.rootModel.destroy({ where: { id } });
    } catch (error) {
      return error;
    }
    return true;
  }

  async update(id: string, updates: Omit<UpdateBody, 'id' | 'createdAt' | 'updatedAt' | 'author'>): Promise<IIdeaOverall | undefined> {
    try {
      const one = await this.rootModel.findOne({ where: { id }, raw: true });

      await this.rootModel.update({ ...updates }, { where: { id } });

      if (updates.tagsAdded) {
        await this.tagsService.create({ parentId: id, tagIds: updates.tagsAdded, parentType: 'note' });
      }
      if (updates.tagsDeleted) {
        await this.tagsService.delete({ parentId: id, tagIds: updates.tagsDeleted });
      }

      if (updates.notesAdded) {
        await this.notesService.create({ parentId: id, noteIds: updates.notesAdded, parentType: 'journal' });
      }
      if (updates.notesDeleted) {
        await this.notesService.delete({ parentId: id, noteIds: updates.notesDeleted });
      }
    } catch (error) {
      return error;
    }

    const one = await this.rootModel.findOne({
      where: { id },
      raw: true
    });

    return {
      ...one,
      tags: await this.tagsService.getByParentId(id),
      notes: await this.notesService.getByParentId(id),
      images: await this.fileService.getByIds(one.images || [])
    }
  }

  async findBy(
    { text, authorId, offset, limit, lastId, tags, notes }:
      Readonly<{ text?: string, authorId: string, limit?: number, offset?: number, lastId?: string, tags?: string[], notes?: string[] }>
  ): Promise<{ data: IIdeaOverall[], isLast?: boolean, total?: number }> {
    let lastItem;

    try {
      if (lastId) {
        lastItem = await this.rootModel.findOne({ where: { id: lastId }, raw: true });
      }

      let result = await this.rootModel.sequelize.query(
        `SELECT *${offset !== undefined ? `, COUNT(*) OVER() as full_count` : ''} FROM "Idea" idea,
        LATERAL (
          SELECT ARRAY (
             SELECT "tagId"
             FROM   "Tags" tags
             WHERE  tags."parentId" = idea.id
             ) AS tags
          ) t,
          LATERAL (
             SELECT ARRAY (
                SELECT "noteId"
                FROM   "Notes" notes
                WHERE  notes."parentId" = idea.id
                ) AS notes
             ) n
          WHERE "authorId"='${authorId}'
          ${text ? `AND LOWER("title") LIKE '%${text.toLowerCase()}%'` : ''}
          ${lastItem ? `AND idea."createdAt" < '${new Date(lastItem.createdAt).toISOString()}'` : ''}
          ORDER BY "createdAt" DESC
          ${limit !== undefined ? `LIMIT ${Number(limit) + 1}` : ''}
          ${offset !== undefined ? `OFFSET ${offset}` : ''}`,
        { type: QueryTypes.SELECT }
      );

      const next = {} as { total?: number, isLast?: boolean };

      if (tags && tags.length) {
        result = result.filter((item: IIdeaOverall) => item.tags.length ? tags.every(t => item.tags.includes(t)) : false)
      }

      if (notes && notes.length) {
        result = result.filter((item: IIdeaOverall) => item.notes.length ? notes.every(t => item.notes.includes(t)) : false)
      }

      if (offset !== undefined) {
        next.total = result[0] ? (result[0] as IIdeaOverall & { full_count: number })?.full_count : 0;
        result.forEach((item: IIdeaOverall & { full_count: number }) => delete item.full_count)
      } else {
        if (limit >= result.length) {
          next.isLast = true;
        } else {
          next.isLast = false;
          result.pop();
        }
      }

      const imagesMap: Record<string, IFile> = {};
      // concat all images 
      const imagesArr = (result.map((idea: IIdea) => idea.images || [])).flat();

      const imgResult = await this.fileService.getByIds(imagesArr);

      for ( const [index, element] of imgResult.entries()){
        imagesMap[element.id] = element;
      }

      return {
        ...next,
        data: result.map((idea: Omit<IIdeaOverall, 'images'> & { images: string[] }) => ({
          ...idea,
          images: idea.images && idea.images.length ? idea.images.map(imgId => imagesMap[imgId]) : []
        }))
      }
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async uploadImage(argsData: { authorId: string, file: Buffer, name: string }): Promise<IFile> {
    try {
      const { authorId, file, name } = argsData;
      const key = `${authorId}_file_${name}`;

      return await this.fileService.uploadPublicFile({ file, key, authorId });
    } catch (error) {
      return error;
    }
  }

  async deleteImage(id: string): Promise<boolean> {
    try {
      return await this.fileService.deletePublicFile(id);
    } catch (e) {
      return e;
    }
  }
}
