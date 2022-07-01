// src/config/config.service.ts
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as path from 'path';

require('dotenv').config();

class ConfigService {
  
  constructor(private env: { [k: string]: string | undefined }) { }
  
  private getValue(key: string, throwOnMissing = true): string {
    const value = this.env[key];
    if (!value && throwOnMissing) {
      throw new Error(`config error - missing env.${key}`);
    }
    
    return value;
  }
  
  public ensureValues(keys: string[]) {
    keys.forEach(k => this.getValue(k, true));
    return this;
  }
  
  public getPort() {
    return this.getValue('PORT', true);
  }
  
  public isProduction() {
    const mode = this.getValue('MODE', false);
    return mode != 'DEV';
  }
  
  public getTypeOrmConfig(isTest: boolean = false): TypeOrmModuleOptions {

    return {
      type: 'postgres',
      host: this.getValue('POSTGRES_HOST'),
      port: parseInt(this.getValue('POSTGRES_PORT')),
      username: this.getValue('POSTGRES_USER'),
      password: this.getValue('POSTGRES_PASSWORD'),
      database: this.getValue('POSTGRES_DATABASE'),
      entities: isTest ? ["src/**/*.entity.ts"] : ["dist/**/*.entity.js"],
      migrationsTableName: 'migrations',
      migrations: ['dist/config/database/migrations/*.js'],
      cli: {
        migrationsDir: 'src/config/database/migrations',
      },
      keepConnectionAlive: true,
      ssl: this.isProduction(),
    };
  }
  
}

const configService = new ConfigService(process.env)
  .ensureValues([
    'POSTGRES_HOST',
    'POSTGRES_PORT',
    'POSTGRES_USER',
    'POSTGRES_PASSWORD',
    'POSTGRES_DATABASE'
  ]);

export { configService };