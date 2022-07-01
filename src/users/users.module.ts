import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserEntity } from '../model';
import { FileModule } from '../file/file.module';

/** UsersModule - contains user ops  */
@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    FileModule
  ],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
