import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { IdeaController } from './idea.controller';
import { IdeaService } from './idea.service';
import { TagsModule } from 'src/tags';
import { IdeaEntity } from 'src/idea/idea.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([IdeaEntity]),
    forwardRef(() => TagsModule)
  ],
  providers: [IdeaService],
  exports: [IdeaService],
  controllers: [IdeaController],
})
export class IdeaModule {}
