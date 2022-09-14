import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { FileEntity } from './file.entity';
import { FileController } from './file.controller';

@Module({
  imports: [
    SequelizeModule.forFeature([FileEntity])
  ],
  providers: [FileService],
  controllers: [FileController],
  exports: [FileService]
})
export class FileModule {}