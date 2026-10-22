import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller.js';
import { OrdersService } from './orders.service.js';
<<<<<<< HEAD
import { OrderItem } from './entities/order-item.entity.js';
import { Order } from './entities/order.entity.js';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem])],
=======

@Module({
>>>>>>> b37f7d0703a18fc5628a260779c78ff87d45ebf7
  controllers: [OrdersController],
  providers: [OrdersService]
})
export class OrdersModule {}
