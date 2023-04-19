import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateEventBookingDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  eventId: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  tickets: number;
}
