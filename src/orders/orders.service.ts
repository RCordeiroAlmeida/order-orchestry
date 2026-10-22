import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity.js';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { OrderItem } from './entities/order-item.entity.js';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
  ) {}

  async createWebhookOrder(createOrderDto: CreateOrderDto) {
    
    // Antes de qualquer coisa, verificamos aqui se o pedido ja foi criado garantindo a idempotência do endpoint
    // FAIL FIRST
    const existingOrder = await this.orderRepository.findOne({
      where: [
        { order_id: createOrderDto.order_id },
        { idempotency_key: createOrderDto.idempotency_key }
      ],
    });

    if (existingOrder) {
      
      return {
        message: '[BLOCKED] Order already exists',
        order_id: existingOrder.order_id,
        status: existingOrder.status,
      };
    }

    let totalAmount = 0;
    const items = createOrderDto.items.map(itemDto => {
      totalAmount += itemDto.qty * itemDto.unit_price;
      const item = new OrderItem();
      item.sku = itemDto.sku;
      item.qty = itemDto.qty;
      item.unit_price = itemDto.unit_price;
      return item;
    });

    const order = new Order();
    order.order_id = createOrderDto.order_id;
    order.idempotency_key = createOrderDto.idempotency_key;
    order.customer_name = createOrderDto.customer.name;
    order.customer_email = createOrderDto.customer.email;
    order.currency = createOrderDto.currency;
    order.total_amount = totalAmount;
    order.status = 'RECEIVED';
    order.items = items;

    const savedOrder = await this.orderRepository.save(order);

    // TODO: Aqui é onde vamos injetar a fila do BullMQ para enfileirar o processamento assíncrono!

    return {
      message: '[SUCCESS] Order created successfully',
      order_id: savedOrder.order_id,
      status: savedOrder.status,
    };
  }

  // Métodos futuros para listar pedidos (GET /orders e GET /orders/:id)
  async findAll(status?: string) {
    const where = status ? { status } : {};
    return this.orderRepository.find({
      where,
      relations: {
        items: true,
      },
    });
  }

  async findOne(id: string) {
    return this.orderRepository.findOne({
      where: { id },
      relations: {
        items: true,
      },
    });
  }
}
