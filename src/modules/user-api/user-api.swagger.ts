import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { version } from '../../../package.json';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

export const setupUserApiSwagger = (app: INestApplication) => {
  const options = new DocumentBuilder()
    .setTitle('USER API SWAGGER')
    .setDescription('description')
    .setVersion(version)
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options, {
    include: [AuthModule, UserModule],
  });

  SwaggerModule.setup('user-api/doc', app, document);
};
