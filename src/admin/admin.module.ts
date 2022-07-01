import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AdminEntity } from '../model';

/** UsersModule - contains user ops  */
@Module({
  imports: [
    TypeOrmModule.forFeature([AdminEntity])
  ],
  providers: [AdminService],
  exports: [AdminService],
  controllers: [AdminController],
})
export class AdminModule {}
