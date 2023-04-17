import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
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
  @IsNumber()
  @IsNotEmpty()
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

  @ApiProperty()
  @IsNumber()
  people: number;

  @ApiProperty()
  @IsNumber()
  toilets: number;

  @ApiProperty()
  @IsNumber()
  chairs: number;

  @ApiProperty()
  @IsNumber()
  tables: number;

  @ApiProperty()
  @IsNumber()
  kitchens: number;

  @ApiProperty({ enum: Wifi })
  @IsEnum(Wifi)
  wifi: Wifi;

  @ApiProperty({ enum: Environment })
  @IsEnum(Environment)
  environment: Environment;

  // @ApiProperty({
  //   type: 'string',
  //   format: 'binary',
  //   description: 'File to be uploaded',
  // })
  // coverImage: Express.Multer.File;

  // @ApiProperty({
  //   type: 'array',
  //   items: {
  //     type: 'string',
  //     format: 'binary',
  //   },
  //   description: 'Files to be uploaded',
  // })
  // images: Express.Multer.File[];
}
