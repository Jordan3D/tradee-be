import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

/** Env spicific config */
module.exports = {
  cookieSecret:
    process.env.COOKIE_SECRET || 'cookie-secret-awdfsedvgrbthgnyhjmnbfd',
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
  morganFormat: 'tiny',
  jwtSecret: process.env.JWT_SECRET || 'some-secret',
  jwt: {
    tokens: {
      access: {
        type: 'access',
        expiresIn:
          typeof process.env.JWT_ACCESS_TOKEN_EXPIRES_IN === 'string'
            ? parseInt(process.env.JWT_ACCESS_TOKEN_EXPIRES_IN, 10)
            : 60 * 60 * 6,
      },
      refresh: {
        type: 'refresh',
        expiresIn:
          typeof process.env.JWT_REFRESH_TOKEN_EXPIRES_IN === 'string'
            ? parseInt(process.env.JWT_REFRESH_TOKEN_EXPIRES_IN, 10)
            : 60 * 60 * 24,
      },
    },
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
  },
  dbConfig:{
    host: process.env.DB_HOST,
    type: 'postgres',
    port: +process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
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
