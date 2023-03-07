import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

enum Price {
  ASCENDING = 'ASCENDING',
  DESCENDING = 'DESCENDING',
}
enum Environment {
  INDOOR = 'INDOOR',
  OUTDOOR = 'OUTDOOR',
}

export class QueryParamDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiProperty({ required: false, enum: Environment })
  @IsEnum(Environment)
  @IsOptional()
  environment?: string;

  @ApiProperty({ required: false, enum: Price })
  @IsOptional()
  @IsEnum(Price)
  price?: Price;
}
