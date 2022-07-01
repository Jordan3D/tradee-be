import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from '../auth/jwt.strategy';
import config from '../config/index';
import * as path from 'path';
import { CreateUserBody } from './dto/requests';
import { UsersService } from './users.service';
import { UserEntity } from '../model';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from '../util/redis/redis.module';
import { configService } from '../config/config.service';
import { ServeStaticModule } from '@nestjs/serve-static';

const testUser: CreateUserBody = {
  email: 'testing@gmail.com',
  password: 'pass',
  name: 'testing'
};
describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(configService.getTypeOrmConfig(true)),
        TypeOrmModule.forFeature([UserEntity]),
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
          secret: config.jwtSecret,
          signOptions: { expiresIn: config.jwt.tokens.access.expiresIn },
        }),
        RedisModule.registerAsync({
          useFactory: () => config.redis,
        }),
      ],
      providers: [
        UsersService,
        JwtStrategy,
      ],
      exports: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  
  describe('success', () => {
    let createdUser: UserEntity;

    it('should create user', async () => {
      createdUser = await service.create(testUser);
      expect(createdUser).toHaveProperty('email');
    });

    it('should find user by email', async () => {
      const userFound = await service.getByEmail(createdUser.email);
      expect(userFound.id).toBe(createdUser.id);
    });

    it('should remove user by id', async () => {
      const userDeleted = await service.remove(createdUser.id);
      expect(userDeleted.id).toBe(undefined);
    });
  });

  describe('error', () => {
    const invalidUser: CreateUserBody = {
      email: 'testingInvalid@gmail.com',
      password: 'pass',
      name: 'testingInvalid'
    };
    it('should return undefined for invalid email', async () => {
      expect(await service.getByEmail(invalidUser.email)).toBe(undefined);
    });
  });
});
