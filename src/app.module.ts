import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { OrdersModule } from './orders/orders.module.js';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: 'database.sqlite',
      autoLoadEntities: true,
      synchronize: true,
    }),
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    OrdersModule,
  ],
})
export class AppModule {}