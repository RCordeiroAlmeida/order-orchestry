import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { OrdersService } from './orders.service.js';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { InjectQueue } from '@nestjs/bull';
import type { Queue } from 'bull';

@Controller()
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    @InjectQueue('orders') private readonly orderQueue: Queue, // Injeta a fila para as métricas
  ) {}

  // Webhook para receber e enfileirar o pedido
  @Post('webhooks/orders')
  async createWebhookOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.createWebhookOrder(createOrderDto);
  }

  // Listar pedidos (com filtro opcional por status: ?status=RECEIVED, etc.)
  @Get('orders')
  async findAll(@Query('status') status?: string) {
    return this.ordersService.findAll(status);
  }

  // Exibir os detalhes de um pedido específico por ID
  @Get('orders/:id')
  async findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  // Exibir informações gerais e métricas da fila 
  @Get('queue/metrics')
  async getQueueMetrics() {
    const counts = await this.orderQueue.getJobCounts();
    return {
      queueName: 'orders',
      metrics: {
        waiting: counts.waiting,     // Aguardando processamento
        active: counts.active,       // Sendo processados agora (PROCESSING)
        completed: counts.completed, // Concluídos com sucesso (COMPLETED)
        failed: counts.failed,       // Falharam / Foram para DLQ
        delayed: counts.delayed,     // Com atraso agendado
      },
    };
  }
}