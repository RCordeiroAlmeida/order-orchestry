import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { OrdersController } from './orders.controller.js';
import { OrdersService } from './orders.service.js';
import { Order } from './entities/order.entity.js';
import { OrderItem } from './entities/order-item.entity.js';
import { OrderProcessor } from './order.processor.js'; // <-- Certifique-se que importou

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem]),
    BullModule.registerQueue({
      name: 'orders', 
    }),
  ],
  controllers: [OrdersController],
  providers: [OrdersService, OrderProcessor], 
})
export class OrdersModule {}