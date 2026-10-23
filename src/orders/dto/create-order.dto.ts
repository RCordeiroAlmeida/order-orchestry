import { IsString, IsEmail, IsNotEmpty, IsArray, ValidateNested, IsNumber, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

class CustomerDto {
  @IsEmail({}, { message: '[WARNING] Customer email is required and must be valid' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: '[WARNING] Customer name is required' })
  name: string;
}

class OrderItemDto {
  @IsString()
  @IsNotEmpty({ message: '[WARNING] SKU is required' })
  sku: string;

  @IsNumber()
  @IsPositive({ message: '[WARNING] Quantity must be a positive number' })
  qty: number;

  @IsNumber()
  @IsPositive({ message: '[WARNING] Unit price must be a positive number' })
  unit_price: number;
}

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty({ message: '[WARNING] Order ID is required' })

  order_id: string;

  @ValidateNested()
  @Type(() => CustomerDto)
  customer: CustomerDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @IsString()
  @IsNotEmpty({ message: '[WARNING] Currency is required' })
  currency: string;

  @IsString()
  @IsNotEmpty({ message: '[WARNING] Idempotency key is required' })
  idempotency_key: string;
}