import * as dotenv from 'dotenv';
import { ConnectionOptions } from 'typeorm-seeding';
import { StringUtils } from './src/common/utils';

dotenv.config({
  path: `.env.${process.env.NODE_ENV || 'development'}`,
});

const env: Record<string, any> = {};
for (const key in process.env) {
  env[key] = StringUtils.getEnvWithoutComment(process.env[key] || '');
}

const connectionOptions: ConnectionOptions = {
  type: env.DATABASE_TYPE as any,
  host: env.DATABASE_HOST,
  port: parseInt(env.MYSQL_PORT),
  username: env.MYSQL_USER,
  password: env.MYSQL_PASSWORD,
  database: env.MYSQL_DATABASE,
  synchronize: false,
  logging: false, // disable logging
  entities: ['src/db/**/*.entity.ts'],
  migrations: ['src/db/migrations/**/*.ts'],
  cli: {
    migrationsDir: 'src/db/migrations',
  },
  seeds: ['src/db/seeding/seeds/**/*.ts'],
  factories: ['src/db/seeding/factories/**/*.ts'],
};

export default connectionOptions;
