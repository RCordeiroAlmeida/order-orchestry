<<<<<<< HEAD
// app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersModule } from './orders/orders.module.js';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: 'database.sqlite',
      autoLoadEntities: true,
      entities: [],
      synchronize: true, // Cria as tabelas automaticamente
    }),
    OrdersModule,
  ],
})
export class AppModule {}
=======
import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import {TypeOrmModule} from "@nestjs/typeorm";
import { OrdersModule } from './orders/orders.module.js';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'better-sqlite3',
    database: 'database.sqlite',
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: true,
  }), OrdersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
>>>>>>> b37f7d0703a18fc5628a260779c78ff87d45ebf7
