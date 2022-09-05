import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { FileEntity } from './file.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([FileEntity])
  ],
  providers: [FileService],
  exports: [FileService]
})
export class FileModule {}