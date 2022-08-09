import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TagsModule } from 'src/tags';
import { TradeService } from './trade.service';
import { NotesModule } from 'src/notes';
import { TradeEntity } from './trade.entity';
import { TradeController } from './trade.controller';

@Module({
  imports: [
    SequelizeModule.forFeature([TradeEntity]),
    forwardRef(() => TagsModule),
    forwardRef(() => NotesModule)
  ],
  providers: [TradeService],
  exports: [TradeService],
  controllers: [TradeController],
})
export class TradeModule {}
