import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './user.controller';
import { UsersService } from './user.service';
import { UserEntity } from '../model';

/** UsersModule - contains user ops  */
@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity])
  ],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
