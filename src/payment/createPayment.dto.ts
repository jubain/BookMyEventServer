import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

enum PaymentType {
  event = 'event',
  venue = 'venue',
}

export class CreatePaymentDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @ApiProperty({ enum: PaymentType })
  @IsEnum(PaymentType)
  type: PaymentType;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  tickets?: number;
}
