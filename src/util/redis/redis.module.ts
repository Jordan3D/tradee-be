import { Global, Logger, Module, OnModuleDestroy } from '@nestjs/common';
import {
  DynamicModule,
  FactoryProvider,
  ModuleMetadata,
  ValueProvider,
} from '@nestjs/common/interfaces';
import { ModuleRef } from '@nestjs/core';
import * as Redis from 'ioredis';
import { REDIS_CLIENT, REDIS_OPTIONS } from './constants';

type ClientOptionsProvider =
  | Omit<ValueProvider<Redis.RedisOptions>, 'provide'>
  | (Omit<FactoryProvider<Redis.RedisOptions>, 'provide' | 'scope'> &
      Pick<ModuleMetadata, 'imports'>);

@Global()
@Module({})
export class RedisModule implements OnModuleDestroy {
  private static isClosing = false;

  constructor(private readonly moduleRef: ModuleRef) {}

  static registerAsync(
    options: ClientOptionsProvider = { useValue: {} },
  ): DynamicModule {
    const imports = 'imports' in options ? options.imports : [];

    return {
      module: RedisModule,
      providers: [
        { provide: REDIS_OPTIONS, ...options },
        {
          provide: REDIS_CLIENT,
          useFactory: (options: Redis.RedisOptions): Promise<Redis.Redis> =>
            new Promise((resolve) => {
              const redis = this.configureRedis(options);

              redis.once('connect', () => resolve(redis));
            }),
          inject: [REDIS_OPTIONS],
        },
      ],
      exports: [REDIS_CLIENT],
      imports,
    };
  }

  private static configureRedis(options: Redis.RedisOptions): Redis.Redis {
    const redis = new Redis(options);

    redis.on('connect', () => {
      Logger.log('Connected to Redis server', 'RedisModule');
    });

    redis.on('error', (error) => {
      Logger.error(
        `Error while connection to Redis server: ${error.message}`,
        undefined,
        'RedisModule',
      );
    });

    redis.on('close', () => {
      if (this.isClosing == true) {
        return;
      }

      Logger.warn('Connection to Redis server has been closed', 'RedisModule');
    });

    redis.on('reconnecting', (ms) => {
      Logger.log(`Will reconnect to Redis server in ${ms} ms`, 'RedisModule');
    });

    redis.on('end', () => {
      Logger.error(
        'Connection to Redis can not be established. Closing app',
        undefined,
        'RedisModule',
      );
      process.exit(1);
    });

    return redis;
  }

  onModuleDestroy() {
    RedisModule.isClosing = true;
    const redis = this.moduleRef.get(Redis);
    redis && redis.disconnect();
  }
}
