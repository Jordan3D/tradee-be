import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './user';
import { TagModule } from './tag';
import { CommentModule } from './comment';
import { NoteModule } from './note';
import { TradeModule } from './trade';
import { PairModule } from './pair';
import { NotesModule } from './notes';
import { BrokerModule } from './broker';
import { TradeTransactionModule } from './tradeTransaction';
import { JournalItemModule } from './journalItem';
import { IdeaModule } from './idea';
import { FileModule } from './file/file.module';
import config from 'src/config';
import { DiaryItemModule } from './diaryItem/diaryItem.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'static'),
    }),
    SequelizeModule.forRoot({
      ...config.dbConfig,
      dialect: 'postgres',
      autoLoadModels: true,
      synchronize: true,
    }),
    AuthModule,
    FileModule,
    UsersModule,
    JournalItemModule,
    TagModule,
    CommentModule,
    NoteModule,
    NotesModule,
    PairModule,
    TradeModule,
    TradeTransactionModule,
    BrokerModule,
    IdeaModule,
    DiaryItemModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}