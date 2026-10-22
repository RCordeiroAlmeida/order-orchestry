import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
<<<<<<< HEAD
=======
import { Order } from './order.entity.js';
>>>>>>> b37f7d0703a18fc5628a260779c78ff87d45ebf7

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  sku: string;

  @Column()
  qty: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  unit_price: number;

<<<<<<< HEAD
  @ManyToOne('Order', (order: any) => order.items, { onDelete: 'CASCADE' })
  order: any;
=======
  // Relacionamento: Vários itens pertencem a um pedido
  @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
  order: Order;
>>>>>>> b37f7d0703a18fc5628a260779c78ff87d45ebf7
}