import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InjectQueue } from '@nestjs/bull';
import type { Queue } from 'bull';
import { Order } from './entities/order.entity.js';
import { CreateOrderDto } from './dto/create-order.dto.js'; // Ajuste a extensão se necessário (.js ou sem extensão)

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectQueue('orders') private readonly orderQueue: Queue,
  ) {}

  // 1. Recebe o webhook, valida idempotência, salva no banco e enfileira
  async createWebhookOrder(createOrderDto: CreateOrderDto) {
    // Validação de Idempotência: Garante que a chave única não foi processada antes
    const existingOrder = await this.orderRepository.findOne({
      where: { idempotency_key: createOrderDto.idempotency_key },
    });

    if (existingOrder) {
      return {
        message: '[INFO] Order already received (Idempotency check passed)',
        order_id: existingOrder.order_id,
        status: existingOrder.status,
      };
    }

    // Calcula o valor total do pedido com base nos itens (com tipagem explícita)
    const totalAmount = createOrderDto.items.reduce(
      (sum: number, item: { qty: number; unit_price: number }) => sum + item.qty * item.unit_price,
      0,
    );

    // Cria a entidade do pedido com status inicial RECEIVED
    const newOrder = this.orderRepository.create({
      order_id: createOrderDto.order_id,
      idempotency_key: createOrderDto.idempotency_key,
      customer_name: createOrderDto.customer.name,
      customer_email: createOrderDto.customer.email,
      currency: createOrderDto.currency,
      total_amount: totalAmount,
      status: 'RECEIVED',
      items: createOrderDto.items.map((item: { sku: string; qty: number; unit_price: number }) => ({
        sku: item.sku,
        qty: item.qty,
        unit_price: item.unit_price,
      })),
    });

    const savedOrder = await this.orderRepository.save(newOrder);

    // 2. ENFILEIRA O PEDIDO COM RETRY E BACKOFF
    await this.orderQueue.add(
      'process-order',
      {
        orderId: savedOrder.id,
        externalOrderId: savedOrder.order_id,
      },
      {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 3000, // 1 segundo de delay inicial
        },
        removeOnComplete: true,
        removeOnFail: false,
      },
    );

    return {
      message: '[SUCCESS] Order received and queued successfully',
      order_id: savedOrder.order_id,
      status: savedOrder.status,
    };
  }

  async findAll(status?: string) {
    const whereCondition = status ? { status: status.toUpperCase() } : {};
    return this.orderRepository.find({
      where: whereCondition,
      relations: { items: true },
    });
  }

  async findOne(id: string) {
    const order = await this.orderRepository.findOne({
      where: { id: id as any },
      relations: { items: true }, // <-- Sintaxe nova
    });

    if (!order) {
      return { message: 'Order not found' };
    }

    return order;
  }
}