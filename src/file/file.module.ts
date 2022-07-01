import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileEntity } from '../model';

@Module({
  imports: [
    TypeOrmModule.forFeature([FileEntity])
  ],
  providers: [FileService],
  exports: [FileService]
})
export class FileModule {}