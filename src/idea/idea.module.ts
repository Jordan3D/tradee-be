import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { IdeaController } from './idea.controller';
import { IdeaService } from './idea.service';
import { TagsModule } from 'src/tags';
import { NotesModule } from 'src/notes';
import { IdeaEntity } from './idea.entity';
import { FileModule } from 'src/file/file.module';

@Module({
  imports: [
    SequelizeModule.forFeature([IdeaEntity]),
    forwardRef(() => TagsModule),
    forwardRef(() => NotesModule),
    forwardRef(() => FileModule)
  ],
  providers: [IdeaService],
  exports: [IdeaService],
  controllers: [IdeaController],
})
export class IdeaModule {}
