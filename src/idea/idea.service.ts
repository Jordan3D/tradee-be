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
      tags = list.map((l: NotesEntity) => l.noteId) || [];
    }

    if (result && result.id && data.photos) {
      Promise.all(data.photos.map(async pId => this.fileService.setParent(pId, result.id, 'idea')))
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
      let photos = one.photos;

      if (updates.photosAdded) {
        photos = photos.concat(updates.photosAdded);
      }
      if (updates.photosDeleted) {
        photos = photos.filter(pId => updates.photosDeleted.includes(pId));
        Promise.all(updates.photosDeleted.map(async pId => await this.fileService.deletePublicFile(pId)))
      }

      await this.rootModel.update({ ...updates, photos }, { where: { id } });

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
      photos: await this.fileService.getByParentId(id)
    }
  }

  async findBy(
    { text, authorId, offset, limit, lastId }:
      Readonly<{ text?: string, authorId: string, limit?: number, offset?: number, lastId?: string }>
  ): Promise<IIdeaOverall[]> {
    let lastItem;
    if(lastId){
      lastItem = await this.rootModel.findOne({where: {id: lastId}, raw: true});
    }
   
    const result =  await this.rootModel.sequelize.query(
      `SELECT *  FROM "Idea" idea,
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
        ${text ? `AND LOWER("title") LIKE LOWER('%${text}%')` : ''}
        ${lastItem ? `AND idea."createdAt" < '${new Date(lastItem.createdAt).toISOString()}'` : ''}
        ORDER BY "createdAt" DESC
        ${limit ? `LIMIT ${limit}` : ''}
        ${offset ? `OFFSET ${offset}` : ''}`,
      { type: QueryTypes.SELECT }
    );

    return Promise.all(result.map(async(idea: IIdeaOverall) => ({
      ...idea,
      photos: await this.fileService.getByParentId(idea.id)
    })))
    
  }

  async uploadPhoto(argsData: { authorId: string, file: Buffer, name: string }): Promise<IFile> {
    try {
      const { authorId, file, name } = argsData;
      const fileName = `${authorId}_file_${name}`;

      return await this.fileService.uploadPublicFile(file, fileName, authorId);
    } catch (error) {
      return error;
    }
  }

  async deletePhoto(id: string): Promise<boolean> {
    try {
      const photo = await this.fileService.getById(id);
      if (photo.parentId && photo.parentType === 'idea') {
        const idea = await this.getById(photo.parentId);
        const photos = idea.photos.slice();
        const index = photos.indexOf(id);
        if (index !== -1) {
          photos.splice(index, 1);
          await this.rootModel.update({ photos }, { where: { id } });
        }
      }

      return await this.fileService.deletePublicFile(id);
    } catch (e) {
      return e;
    }
  }
}
