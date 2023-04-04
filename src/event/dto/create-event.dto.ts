import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsString,
  MinDate,
} from 'class-validator';

export class CreateEventDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  tickets: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty()
  @IsDate()
  @MinDate(new Date())
  @IsNotEmpty()
  @Type(() => Date)
  startDate: Date;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  startTime: string;

  @ApiProperty()
  @IsDate()
  @MinDate(new Date())
  @IsNotEmpty()
  @Type(() => Date)
  endDate: Date;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  endTime: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  venueId: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  type: string;
}
