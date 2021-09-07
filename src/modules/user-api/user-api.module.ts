import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { RouterModule } from 'nest-router';

import { UserApiMiddleware } from './user-api.middleware';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    RouterModule.forRoutes(
      [UserModule].map((module) => ({
        path: 'user-api',
        module,
      })),
    ),
    AuthModule,
    UserModule,
  ],
})
export class UserApiModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserApiMiddleware).forRoutes({ path: 'user-api', method: RequestMethod.ALL });
  }
}
