import { forwardRef, Module } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { UsersModule } from '../users';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameEntity, UserEntity } from '../model';
import { ManagerModule } from './manager/manager.module';
import { SystemModule } from '../system';

@Module({
  imports: [
    TypeOrmModule.forFeature([GameEntity, UserEntity]),
    UsersModule,
    forwardRef(() => ManagerModule),
    forwardRef(() => SystemModule),
  ],
  providers: [
    GameGateway,
    GameService
  ],
  exports: [GameService],
  controllers: [GameController],
})
export class GameModule {}