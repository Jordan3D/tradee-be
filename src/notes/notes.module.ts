import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { NotesEntity } from './notes.entity';
import { NotesService } from './notes.service';

@Module({
  imports: [
    SequelizeModule.forFeature([NotesEntity])
  ],
  providers: [NotesService],
  exports: [NotesService],
  controllers: [],
})
export class NotesModule {}
