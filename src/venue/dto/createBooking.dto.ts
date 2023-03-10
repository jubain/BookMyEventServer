import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsNumber, MinDate } from 'class-validator';

export class CreateVenueBookingDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  venueId: number;

  @ApiProperty()
  @IsDate()
  @MinDate(new Date())
  @IsNotEmpty()
  @Type(() => Date)
  startDate: Date;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  endDate: Date;
}
