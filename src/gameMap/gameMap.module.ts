import { Module } from '@nestjs/common';
import { GameMapService } from './gameMap.service';
import { GameMapController } from './gameMap.controller';
import { UsersModule } from '../users';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameMapEntity } from '../model';

@Module({
  imports: [
    TypeOrmModule.forFeature([GameMapEntity])
  ],
  providers: [
    GameMapService
  ],
  exports: [GameMapService],
  controllers: [GameMapController],
})
export class GameMapModule {}