import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { EmployeesModule } from './employees/employees.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { MyLoggerService } from './my-logger/my-logger.service';
import { MyLoggerModule } from './my-logger/my-logger.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    DatabaseModule,
    EmployeesModule,
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 60,000 milliseconds = 1 minute
        limit: 3, // Maximum 3 requests
      },
    ]),
    MyLoggerModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD, // Use the ThrottlerGuard globally
      useClass: ThrottlerGuard, // Apply the ThrottlerGuard to all routes
    },
    MyLoggerService,
  ],
})
export class AppModule {}
