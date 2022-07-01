import { forwardRef, Module } from '@nestjs/common';
import { ActionService } from './action.service';
import { GameModule } from '../game.module';
import { ManagerModule } from '../manager/manager.module';

@Module({
  imports: [
    forwardRef(() => GameModule),
    forwardRef(() => ManagerModule),
  ],
  providers: [
    ActionService
  ],
  exports: [ActionService],
})
export class ActionModule {}