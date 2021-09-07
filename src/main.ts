import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';

import { AppModule } from './app.module';
import { setupUserApiSwagger } from '@modules/user-api/user-api.swagger';
import { setupAdminApiSwagger } from '@modules/admin-api/admin-api.swagger';

import { EnvConfiguration } from '@config/configuration';

dotenv.config({
  path: `.env.${process.env.NODE_ENV || 'development'}`,
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  const configService: ConfigService<EnvConfiguration> = app.get(ConfigService);
  app.use(cookieParser());

  // enable cors
  app.enableCors({ origin: configService.get('allowedHosts') });

  // swagger
  if (configService.get('enableSwagger')) {
    setupUserApiSwagger(app);
    setupAdminApiSwagger(app);
  }
  await app.listen(configService.get('port') || 3000);
}
bootstrap();
