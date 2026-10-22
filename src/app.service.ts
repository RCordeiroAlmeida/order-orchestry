import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
<<<<<<< HEAD
    return 'Orquestrador de Pedidos is running!';
=======
    return 'Hello World!';
>>>>>>> b37f7d0703a18fc5628a260779c78ff87d45ebf7
  }
}
