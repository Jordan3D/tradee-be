import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PairService } from './pair.service';
import { PairController } from './pair.controller';
import { PairEntity } from './pair.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([PairEntity])
  ],
  providers: [PairService],
  exports: [PairService],
  controllers: [PairController],
})
export class PairModule {}
