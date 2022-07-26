import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersController } from './user.controller';
import { UsersService } from './user.service';
import { UserEntity } from 'src/models';

/** UsersModule - contains user ops  */
@Module({
  imports: [
    SequelizeModule.forFeature([UserEntity])
  ],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
