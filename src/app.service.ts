import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {

    return 'Orquestrador de Pedidos is running!';
  }
}
