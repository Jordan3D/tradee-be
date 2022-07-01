import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users';
import { TokenEntity } from '../model';
import { AuthController } from './auth.controller';
import { AdminModule } from '../admin';

@Module({
  imports: [
    TypeOrmModule.forFeature([TokenEntity]),
    UsersModule,
    AdminModule
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
