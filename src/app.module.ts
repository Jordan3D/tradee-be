import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { GameModule } from './game/game.module';
import config from './config';
import * as path from 'path';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { configService } from './config/config.service';
import { UsersModule } from './users';
import { ItemModule } from './item/item.module';
import { ItemGroupModule } from './itemGroup/itemGroup.module';
import { JwtStrategy } from './auth/jwt.strategy';
import { UserJwtStrategy } from './auth/user.jwt.strategy';
import { AdminJwtStrategy } from './auth/admin.jwt.strategy';
import { RedisModule } from './util/redis/redis.module';
import { ManagerModule } from './game/manager/manager.module';
import { GameMapModule } from './gameMap/gameMap.module';
import { ActionModule } from './game/action/action.module';
import { SystemModule } from './system/system.module';
import { AdminModule } from './admin';
import { FileModule } from './file/file.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'static'),
    }),
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    PassportModule.register({ defaultStrategy: 'user_jwt' }),
    JwtModule.register({
      secret: config.jwtSecret,
      signOptions: { expiresIn: config.jwt.tokens.access.expiresIn },
    }),
    RedisModule.registerAsync({
      useFactory: () => config.redis,
    }),
    FileModule,
    AdminModule,
    UsersModule,
    AuthModule,
    ItemModule,
    GameMapModule,
    ItemGroupModule,
    GameModule,
    ActionModule,
    ManagerModule,
    SystemModule,
  ],
  controllers: [AppController],
  providers: [AppService, JwtStrategy, UserJwtStrategy, AdminJwtStrategy],
})
export class AppModule {}