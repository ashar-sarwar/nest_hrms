import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';

@Module({
  providers: [DatabaseService],
  exports: [DatabaseService], // allows other modules to use DatabaseService
})
export class DatabaseModule {}
