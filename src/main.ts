import { NestFactory } from '@nestjs/core';
import config from './config/index';
import * as helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe, Logger } from '@nestjs/common';
import { WsAdapter } from '@nestjs/platform-ws';
import { config as awsConfig } from 'aws-sdk';

async function bootstrap() {
  const logger = new Logger('bootstrap');
  
  /** app instance */
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  /** ws*/
  app.useWebSocketAdapter(new WsAdapter(app));
  
  /** security tweaks */
  app.enable('trust proxy');
  app.enableCors(config.cors);
  app.use(helmet());
  app.use(cookieParser(config.cookieSecret));
  
  awsConfig.update({
    accessKeyId: config.aws.accessKeyId,
    secretAccessKey: config.aws.secretAccessKey,
    region: config.aws.region,
  });
  
  /** validate all request dtos */
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  
  await app.listen(config.http.port);
  logger.log(`app is listening on port ${config.http.port}`);
}
bootstrap();
