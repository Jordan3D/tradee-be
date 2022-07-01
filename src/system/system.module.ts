import { forwardRef, Module } from '@nestjs/common';
import { SystemController } from './system.controller';
import { SystemService } from './system.service';
import { GameModule } from '../game/game.module';
import { GameEntity } from '../model';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UpdateEntity } from '../model/update.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([GameEntity, UpdateEntity]),
    forwardRef(() => GameModule),
  ],
  providers: [SystemService],
  exports: [SystemService],
  controllers: [SystemController],
})
export class SystemModule {}
