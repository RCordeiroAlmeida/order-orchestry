import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

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

  @ManyToOne('Order', (order: any) => order.items, { onDelete: 'CASCADE' })
  order: any;
}