import { IsString, IsEmail, IsNotEmpty, IsArray, ValidateNested, IsNumber, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

<<<<<<< HEAD
class CustomerDto {
  @IsEmail({}, { message: '[WARNING] Customer email is required and must be valid' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: '[WARNING] Customer name is required' })
=======

//Validações basicas para o DTO de criação de pedido, garantindo que os dados recebidos estejam no formato correto e atendam aos requisitos mínimos antes de serem processados pela aplicação.

class CustomerDto {
  @IsEmail({}, { message: 'O e-mail do cliente deve ser válido.' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'O nome do cliente não pode estar vazio.' })
>>>>>>> b37f7d0703a18fc5628a260779c78ff87d45ebf7
  name: string;
}

class OrderItemDto {
  @IsString()
<<<<<<< HEAD
  @IsNotEmpty({ message: '[WARNING] SKU is required' })
  sku: string;

  @IsNumber()
  @IsPositive({ message: '[WARNING] Quantity must be a positive number' })
  qty: number;

  @IsNumber()
  @IsPositive({ message: '[WARNING] Unit price must be a positive number' })
=======
  @IsNotEmpty({ message: 'O SKU do item é obrigatório.' })
  sku: string;

  @IsNumber()
  @IsPositive({ message: 'A quantidade deve ser maior que zero.' })
  qty: number;

  @IsNumber()
  @IsPositive({ message: 'O preço unitário deve ser positivo.' })
>>>>>>> b37f7d0703a18fc5628a260779c78ff87d45ebf7
  unit_price: number;
}

export class CreateOrderDto {
  @IsString()
<<<<<<< HEAD
  @IsNotEmpty({ message: '[WARNING] Order ID is required' })
=======
  @IsNotEmpty({ message: 'O order_id é obrigatório.' })
>>>>>>> b37f7d0703a18fc5628a260779c78ff87d45ebf7
  order_id: string;

  @ValidateNested()
  @Type(() => CustomerDto)
  customer: CustomerDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @IsString()
<<<<<<< HEAD
  @IsNotEmpty({ message: '[WARNING] Currency is required' })
  currency: string;

  @IsString()
  @IsNotEmpty({ message: '[WARNING] Idempotency key is required' })
=======
  @IsNotEmpty({ message: 'A moeda é obrigatória.' })
  currency: string;

  @IsString()
  @IsNotEmpty({ message: 'A chave de idempotência é obrigatória.' })
>>>>>>> b37f7d0703a18fc5628a260779c78ff87d45ebf7
  idempotency_key: string;
}