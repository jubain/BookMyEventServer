import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { Cities } from 'src/venue/dto/cities';

enum Price {
  ASCENDING = 'ASCENDING',
  DESCENDING = 'DESCENDING',
}
enum Environment {
  INDOOR = 'INDOOR',
  OUTDOOR = 'OUTDOOR',
}

enum Event_Type {
  ANY = 'ANY',
  SPORTS = 'SPORTS',
  CHILDREN = 'CHILDREN',
  ADULT = 'ADULT',
  CARS = 'CARS',
  MOTOBIKE = 'MOTOBIKE',
  GAME = 'GAME',
  TECHNOLOGY = 'TECHNOLOGY',
}

export class QueryParamDto {
  @ApiProperty({ required: false, enum: Cities, enumName: 'cities' })
  @IsEnum(Cities)
  @IsOptional()
  city?: Cities;

  //   @ApiProperty({ enum: Event_Type, required: false })
  //   @IsOptional()
  //   @IsEnum(Event_Type)
  //   type?: Event_Type;

  //   @ApiProperty({ required: false, enum: Environment })
  //   @IsEnum(Environment)
  //   @IsOptional()
  //   environment?: string;

  @ApiProperty({ required: false, enum: Price })
  @IsOptional()
  @IsEnum(Price)
  price?: Price;
}
