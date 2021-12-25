import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule, ConfigService } from '@nestjs/config'
const cookieSession = require('cookie-session');

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { User } from './users/user.entity';
import { Report } from './reports/report.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ 
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'sqlite',
          database: config.get('DB_NAME'),
          entities: [User, Report],
          // IMPORTANT
          // Whenever our app starts up typeorm is goin to look at user( and report) entity
          // all the properties and types and check status of DB and make sure db has exact all the same properties as user entity
          // EXAMPLE: If we delete/add userEmail field from entity file, with help of this property typeorm automatically deletes/adds userEmail field from db records
          synchronize: true 
        }
      }
    }),
    UsersModule,
    ReportsModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        // TO MAKE SURE INCOMING REUQEST DOESN'T HAVE OTHER PROPERTIES
        // THEY WILL AUTOMATICALLY REMOVED
        whitelist: true
      })
    }
  ],
})
export class AppModule {
  constructor(private config: ConfigService) {}
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(
      cookieSession({
        keys: [this.config.get('COOKIE_KEY')]
      })
      // Configure this middleware for every route
    ).forRoutes('*');
  }
}
