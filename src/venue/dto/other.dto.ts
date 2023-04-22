import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Cities } from './cities';
import { Type } from 'class-transformer';

enum Price {
  ASCENDING = 'ASCENDING',
  DESCENDING = 'DESCENDING',
}
enum Environment {
  INDOOR = 'INDOOR',
  OUTDOOR = 'OUTDOOR',
}

enum Venue_Type {
  ANY = 'ANY',
  WEDDING = 'WEDDING',
  CONVENTION = 'CONVENTION',
  SOCIAL = 'SOCIAL',
  NETWORKING = 'NETWORKING',
  CORPORATE = 'CORPORATE',
  FESTIVAL = 'FESTIVAL',
  FASHION = 'FASHION',
  CLUB = 'CLUB',
}

class Coordinates {
  @ApiProperty({ default: null })
  @IsNumber()
  @IsOptional()
  lat: number;

  @ApiProperty({ default: null })
  @IsNumber()
  @IsOptional()
  lng: number;
}

export class QueryParamDto {
  @ApiProperty({ required: false, enum: Cities, enumName: 'cities' })
  @IsEnum(Cities)
  @IsOptional()
  city?: Cities;

  @ApiProperty({ enum: Venue_Type, required: false })
  @IsOptional()
  @IsEnum(Venue_Type)
  type?: Venue_Type;

  @ApiProperty({ required: false, enum: Environment })
  @IsEnum(Environment)
  @IsOptional()
  environment?: string;

  @ApiProperty({ required: false, enum: Price })
  @IsOptional()
  @IsEnum(Price)
  price?: Price;
}

export class FindVenueDto {
  @ApiProperty({ type: Coordinates })
  @ValidateNested()
  @IsOptional()
  @Type(() => Coordinates)
  coordinates?: Coordinates;
}

export class AddImageDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  venueId: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  type: 'coverImage' | 'extraImages';

  @ApiProperty({
    type: 'string',
    format: 'binary',
    items: {
      type: 'string',
      format: 'binary',
    },
    description: 'File to be uploaded',
    required: false,
  })
  @IsOptional({ always: true })
  image?: Express.Multer.File;

  // @ApiProperty({ required: true })
  // @IsNotEmpty()
  // @IsString()
  // coverimage: string;

  // @ApiProperty({
  //   type: 'array',
  //   items: {
  //     type: 'string',
  //     format: 'binary',
  //   },
  //   required: true,
  // })
  // @IsOptional({ always: true })
  // extraImages?: Express.Multer.File[];
}
