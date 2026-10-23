import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { OrderItem } from './order-item.entity.js';

@Entity('orders')
export class Order {

   // Atributos fornecidos na documentação: 

  // ** order_id
  // ** customer { email, name }
  // ** items [{sku, qty, unity_price}] -> se transforma na entidade order-item
  // ** currency
  // ** idempotency_key 

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  order_id: string; // Id de pedido externo que vem via webhook

  @Column({ unique: true })
  idempotency_key: string; // Id de idempotencia para evitar duplicidade de pedidos

  @Column()
  customer_name: string; // Nome do cliente

  @Column()
  customer_email: string; //Email do cliente

  @Column()
  currency: string; //Moeda do pedido

  @Column('decimal', { precision: 10, scale: 4, nullable: true })
  exchange_rate: number; // cotação obtida da API externa

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  converted_amount: number; // valor total convertido para BRL

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  total_amount: number;

  @Column({ default: 'RECEIVED' })
  status: string; // RECEIVED, PROCESSING, COMPLETED, FAILED_ENRICHMENT

  // Relacionamento: Um pedido tem vários itens
  @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
  items: OrderItem[];

  @CreateDateColumn()
  created_at: Date;
}