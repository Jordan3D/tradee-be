import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TradeTransactionController } from './tradeTransaction.controller';
import { TradeTransactionEntity } from './tradeTransaction.entity';
import { TradeTransactionService } from './tradeTransaction.service';

@Module({
  imports: [
    SequelizeModule.forFeature([TradeTransactionEntity]),
  ],
  providers: [TradeTransactionService],
  exports: [TradeTransactionService],
  controllers: [TradeTransactionController],
})
export class TradeTransactionModule {}
