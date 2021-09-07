import * as Joi from 'joi';
import { StringUtils } from '@common/utils';

export interface EnvConfiguration {
  nodeEnv: 'development' | 'staging' | 'production';
  port: number;
  allowedHosts: Array<string>;
  enableSwagger: boolean;
  secret: string;
  tokenExpires: number;
  refreshTokenExpires: string;
  throttleTTL: number;
  throttleLimit: number;
  cacheRequestTTL: number;
  cacheRequestMax: number;

  databaseType: string;
  databaseHost: string;
  mysqlDatabase: string;
  mysqlUser: string;
  mysqlPassword: string;
  mysqlRootPassword: string;
  mysqlPort: number;
  phpmyadminPort: number;
}

const validationSchema = Joi.object<any, EnvConfiguration>({
  nodeEnv: Joi.string().valid('development', 'staging', 'production').required(),
  port: Joi.number().required(),
  allowedHosts: Joi.array().items(Joi.string()),
  enableSwagger: Joi.boolean().required(),
  secret: Joi.string().required(),
  tokenExpires: Joi.number().required(),
  refreshTokenExpires: Joi.string().required(),
  throttleTTL: Joi.number().required(),
  throttleLimit: Joi.number().required(),
  cacheRequestTTL: Joi.number().required(),
  cacheRequestMax: Joi.number().required(),

  databaseType: Joi.string().required(),
  databaseHost: Joi.string().required(),
  mysqlDatabase: Joi.string().required(),
  mysqlUser: Joi.string().required(),
  mysqlPassword: Joi.string().required(),
  mysqlRootPassword: Joi.string().required(),
  mysqlPort: Joi.number().required(),
  phpmyadminPort: Joi.number().required(),
});

export default () => {
  const env: Record<string, any> = {};
  for (const key in process.env) {
    env[key] = StringUtils.getEnvWithoutComment(process.env[key] || '');
  }

  const envConfiguration: Partial<EnvConfiguration> = {
    nodeEnv: env.NODE_ENV || 'development',
    port: parseInt(env.PORT) || 3000,
    allowedHosts: env.ALLOWED_HOSTS ? env.ALLOWED_HOSTS.replace(/ /g, '').split(',') : [],
    enableSwagger: env.ENABLE_SWAGGER ? ['true', 1, true].includes(env.ENABLE_SWAGGER) : false,
    secret: env.SECRET,
    tokenExpires: parseInt(env.TOKEN_EXPIRES) || 3600,
    refreshTokenExpires: env.REFRESH_TOKEN_EXPIRES || '1d',
    throttleTTL: parseInt(env.THROTTLE_TTL) || 60,
    throttleLimit: parseInt(env.THROTTLE_LIMIT) || 20,
    cacheRequestTTL: parseInt(env.CACHE_REQUEST_TTL) || 5,
    cacheRequestMax: parseInt(env.CACHE_REQUEST_MAX) || 10,

    databaseType: env.DATABASE_TYPE,
    databaseHost: env.DATABASE_HOST,
    mysqlDatabase: env.MYSQL_DATABASE,
    mysqlUser: env.MYSQL_USER,
    mysqlPassword: env.MYSQL_PASSWORD,
    mysqlRootPassword: env.MYSQL_ROOT_PASSWORD,
    mysqlPort: parseInt(env.MYSQL_PORT),
    phpmyadminPort: parseInt(env.PHPMYADMIN_PORT),
  };

  const { error } = validationSchema.validate(envConfiguration);
  if (error) {
    throw new Error(`ENV configuration error: ${error.message}`);
  }

  return envConfiguration;
};
