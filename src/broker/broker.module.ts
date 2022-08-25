import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TagsModule } from 'src/tags';
import { BrokerService } from './broker.service';
import { NotesModule } from 'src/notes';
import { BrokerEntity } from './broker.entity';
import { BrokerController } from './broker.controller';
import { PairModule } from 'src/pair';
import { TradeModule } from 'src/trade';
import { TradeTransactionModule } from 'src/tradeTransaction';

@Module({
  imports: [
    SequelizeModule.forFeature([BrokerEntity]),
    forwardRef(() => TagsModule),
    forwardRef(() => NotesModule),
    forwardRef(() => PairModule),
    forwardRef(() => TradeModule),
    forwardRef(() => TradeTransactionModule),
  ],
  providers: [BrokerService],
  exports: [BrokerService],
  controllers: [BrokerController],
})
export class BrokerModule {}
