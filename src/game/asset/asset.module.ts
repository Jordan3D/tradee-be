import { forwardRef, Module } from '@nestjs/common';
import { AssetService } from './asset.service';
import { ItemEntity } from '../../model';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemModule } from '../../item/item.module';
import { GameModule } from '../game.module';

@Module({
  imports: [
    ItemModule,
    forwardRef(() => GameModule),
  ],
  providers: [
    AssetService
  ],
  exports: [AssetService],
})
export class AssetModule {}