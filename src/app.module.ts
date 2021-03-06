import { CacheInterceptor, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration, { EnvConfiguration } from '@config/configuration';

import { AdminApiModule } from './modules/admin-api/admin-api.module';
import { UserApiModule } from './modules/user-api/user-api.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.${process.env.NODE_ENV}.local`, `.env.${process.env.NODE_ENV}`],
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<EnvConfiguration>) => {
        return {
          type: configService.get('databaseType') as any,
          host: configService.get('databaseHost'),
          port: configService.get('mysqlPort'),
          username: configService.get('mysqlUser'),
          password: configService.get('mysqlPassword'),
          database: configService.get<string>('mysqlDatabase'),
          // try autoload entities
          autoLoadEntities: true,
          // use cli and run schema:sync is better for secured data
          synchronize: false,
        };
      },
    }),
    AdminApiModule,
    UserApiModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class AppModule {}
