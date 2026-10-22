<<<<<<< HEAD
import { Controller, Post, Get, Param, Query, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { OrdersService } from './orders.service.js';
import { CreateOrderDto } from './dto/create-order.dto.js';

@Controller() 
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // Definindo a rota exata solicitada no desafio: POST /webhooks/orders
  @Post('webhooks/orders')
  @HttpCode(HttpStatus.CREATED)
  async receiveWebhook(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.createWebhookOrder(createOrderDto);
  }

  // Rota para listar pedidos: GET /orders
  @Get('orders')
  async findAll(@Query('status') status?: string) {
    return this.ordersService.findAll(status);
  }

  // Rota para exibir detalhes de um pedido específico: GET /orders/:id
  @Get('orders/:id')
  async findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }
}
=======
import { Controller } from '@nestjs/common';

@Controller('orders')
export class OrdersController {}
>>>>>>> b37f7d0703a18fc5628a260779c78ff87d45ebf7
