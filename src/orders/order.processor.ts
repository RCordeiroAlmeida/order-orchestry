import { Process, Processor } from '@nestjs/bull';
import type { Job } from 'bull';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity.js';

@Processor('orders')
export class OrderProcessor {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  @Process('process-order')
  async handleProcessOrder(job: Job<{ orderId: string; externalOrderId: string }>) {
    const { orderId } = job.data;
    console.log(`[WORKER] Starting processing of order ID: ${orderId} (Attempt ${job.attemptsMade + 1})...`);

    const order = await this.orderRepository.findOne({ 
      where: { id: String(orderId) as any },
      relations: { items: true },
    });

    if (!order) {
      console.log(`[WORKER] Order ${orderId} not found.`);
      return;
    }

    try {
      console.log(`[WORKER] Atualizando status para PROCESSING...`);
      order.status = 'PROCESSING';
      await this.orderRepository.save(order);

      // Simulação direta e segura para isolar o problema de rede
      let exchangeRate = 5.45;
      if (order.currency && order.currency.toUpperCase() === 'EUR') {
        exchangeRate = 6.10;
      }

      const convertedValue = order.total_amount * exchangeRate;
      
      // Atribui os valores
      order.exchange_rate = Number(exchangeRate.toFixed(4));
      order.converted_amount = Number(convertedValue.toFixed(2));
      order.status = 'COMPLETED';

      console.log(`[WORKER] Salvando pedido concluído no banco...`);
      await this.orderRepository.save(order);

      console.log(`[WORKER] SUCESSO TOTAL! Pedido ${orderId} concluído.`);

    } catch (err: unknown) {
      // EXIBE O ERRO REAL EXATAMENTE COMO ELE ACONTECE NO TERMINAL
      console.error(`\n================ ERRO CRÍTICO NO WORKER ================\n`);
      console.error(err);
      console.error(`\n=======================================================\n`);

      const MAX_ATTEMPTS = 3;
      if (job.attemptsMade + 1 >= MAX_ATTEMPTS) {
        console.error(`[DLQ] Esgotadas as tentativas. Marcando como FAILED_ENRICHMENT.`);
        try {
          order.status = 'FAILED_ENRICHMENT';
          await this.orderRepository.save(order);
        } catch (dbError) {
          console.error(`[DB ERROR] Falha ao salvar status de erro:`, dbError);
        }
      }

      throw err;
    }
  }
}