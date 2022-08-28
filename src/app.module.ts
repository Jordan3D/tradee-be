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

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'static'),
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: "127.0.0.1",
      port: 5432,
      username: "igoryovka",
      password: "1111",
      database: "postgres",
      autoLoadModels: true,
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
    JournalItemModule,
    TagModule,
    CommentModule,
    NoteModule,
    NotesModule,
    PairModule,
    TradeModule,
    TradeTransactionModule,
    BrokerModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}