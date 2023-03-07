import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export enum Environment {
  INDOOR = 'INDOOR',
  OUTDOOR = 'OUTDOOR',
}

export enum Wifi {
  YES = 'YES',
  NO = 'NO',
}

export class CreateVenueDto {
  @ApiProperty({ type: 'string' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d+$/, { message: 'Must be a number!' })
  price: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  address1: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  address2: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  postcode: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  country: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  website?: string;

  @ApiProperty({ type: 'number' })
  @IsString()
  @Matches(/^\d+$/, { message: 'Must be a number!' })
  people: number;

  @ApiProperty({ type: 'number' })
  @IsString()
  @Matches(/^\d+$/, { message: 'Must be a number!' })
  toilets: number;

  @ApiProperty()
  @IsString()
  @Matches(/^\d+$/, { message: 'Must be a number!' })
  chairs: number;

  @ApiProperty()
  @IsString()
  @Matches(/^\d+$/, { message: 'Must be a number!' })
  tables: number;

  @ApiProperty()
  @IsString()
  @Matches(/^\d+$/, { message: 'Must be a number!' })
  kitchens: number;

  @ApiProperty({ enum: Wifi })
  @IsEnum(Wifi)
  wifi: Wifi;

  @ApiProperty({ enum: Environment })
  @IsEnum(Environment)
  environment: Environment;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'File to be uploaded',
  })
  coverImage: Express.Multer.File;

  @ApiProperty({
    type: 'array',
    items: {
      type: 'string',
      format: 'binary',
    },
    description: 'Files to be uploaded',
  })
  images: Express.Multer.File[];
}
