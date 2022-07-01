import { forwardRef, Module } from '@nestjs/common';
import { ManagerService } from './manager.service';
import { ItemGroupModule } from '../../itemGroup/itemGroup.module';
import { ItemModule } from '../../item/item.module';
import { GameModule } from '../game.module';
import { GameMapModule } from '../../gameMap/gameMap.module';
import { ActionModule } from '../action/action.module';

@Module({
  imports: [
    ItemModule,
    ItemGroupModule,
    GameMapModule,
    forwardRef(() => GameModule),
    ActionModule,
  ],
  providers: [
    ManagerService
  ],
  exports: [ManagerService],
})
export class ManagerModule {}