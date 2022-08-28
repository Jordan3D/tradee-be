import {
  Injectable
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { NotesEntity } from './notes.entity';

@Injectable()
export class NotesService {

  constructor(
    @InjectModel(NotesEntity) private readonly rootModel: typeof NotesEntity
  ) { }

  async create(
    { parentId, noteIds, parentType }:
      Readonly<{ noteIds: string[], parentId: string, parentType: 'trade' | 'idea' | 'journal'}>): Promise<NotesEntity[]> {
    const result = await this.rootModel.bulkCreate(noteIds.map(item => ({ parentId, noteId: item, parentType })));
    return result.map(item => item.toJSON())
  }

  async getByParentId(parentId: string): Promise<string[]> {
    const result = await this.rootModel.findAll({ where: { parentId }, raw: true });

    return result ? result.map(item => item.noteId) : [];
  }

  async delete({ parentId, noteIds }: Readonly<{ noteIds: string[], parentId: string }>): Promise<boolean> {
    const res = await this.rootModel.destroy({ where: { parentId, noteId: noteIds } });

    return !!res;
  }
}
