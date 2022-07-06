import { NestFactory } from '@nestjs/core';
import config from './config/index';
import * as helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe, Logger } from '@nestjs/common';

declare const module: any;

async function bootstrap() {
  const logger = new Logger('bootstrap');

  /** app instance */
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  /** security tweaks */
  app.enable('trust proxy');
  app.enableCors(config.cors);
  app.use(helmet());
  app.use(cookieParser(config.cookieSecret));
  
  /** validate all request dtos */
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  
  await app.listen(config.http.port);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }

  logger.log(`app is listening on port ${config.http.port}`);
}
bootstrap();
