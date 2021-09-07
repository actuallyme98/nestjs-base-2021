import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { RouterModule } from 'nest-router';

import { AdminApiMiddleware } from './admin-api.middleware';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    RouterModule.forRoutes(
      [UserModule].map((module) => ({
        path: 'admin-api',
        module,
      })),
    ),
    AuthModule,
    UserModule,
  ],
})
export class AdminApiModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(AdminApiMiddleware).forRoutes({ path: 'admin-api', method: RequestMethod.ALL });
  }
}
