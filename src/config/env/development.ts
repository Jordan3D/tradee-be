import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

/** Env spicific config */
module.exports = {
  cookieSecret: process.env.COOKIE_SECRET || 'cookie-secret',
  cors: {
    allowedHeaders: ['Origin', 'Content-Type', 'Accept', 'Authorization'],
    origin: process.env.CORS_ALLOWED_ORIGIN
      ? process.env.CORS_ALLOWED_ORIGIN.split(' ')
      : '*',
    credentials: true,
  } as CorsOptions,
  http: {
    port: process.env.PORT || 3000,
  },
  morganFormat: 'dev',
  jwtSecret: 'secretKey',
  jwt: {
    tokens: {
      access: {
        type: 'access',
        expiresIn: 60 * 60 * 2,
      },
      refresh: {
        type: 'refresh',
        expiresIn: 60 * 60 * 12,
      },
    },
  },
  dbConfig:{
    host: process.env.POSTGRES_HOST,
    type: 'postgres',
    port: process.env.POSTGRES_PORT,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
    migrations: ['dist/shared/migrations/*.js'],
    synchronize: false,
    logging: process.env.LOG_DB === 'true',
  },
  aws: {
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    bucket: process.env.AWS_PUBLIC_BUCKET_NAME,
  }
};
