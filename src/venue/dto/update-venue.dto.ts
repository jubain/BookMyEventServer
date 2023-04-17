import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Environment, Wifi } from './create-venue.dto';

export class UpdateVenueDto {
  @ApiProperty({ type: 'string', required: false })
  @IsString()
  @IsNotEmpty()
  @IsOptional({ always: true })
  name?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsNotEmpty()
  description?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  type?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsNotEmpty()
  // @IsOptional({ always: true })
  // @Matches(/^\d+$/, { message: 'Must be a number!' })
  price?: number;

  @ApiProperty({ required: false })
  @IsString()
  // @IsOptional({ always: true })
  @IsNotEmpty()
  address1?: string;

  @ApiProperty({ required: false })
  @IsString()
  // @IsOptional({ always: true })
  @IsNotEmpty()
  address2?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsNotEmpty()
  city?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsNotEmpty()
  postcode?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsNotEmpty()
  country?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  // @Matches(
  //   /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi,
  //   { message: 'Should be valid website' },
  // )
  website?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsNotEmpty() // @Matches(/^\d+$/, { message: 'Must be a number!' })
  people?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsNotEmpty() // @Matches(/^\d+$/, { message: 'Must be a number!' })
  toilets?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsNotEmpty() // @Matches(/^\d+$/, { message: 'Must be a number!' })
  chairs?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsNotEmpty() // @Matches(/^\d+$/, { message: 'Must be a number!' })
  tables?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsNotEmpty() // @Matches(/^\d+$/, { message: 'Must be a number!' })
  kitchens?: number;

  @ApiProperty({ enum: Wifi, required: false })
  @IsEnum(Wifi)
  @IsNotEmpty()
  wifi?: Wifi;

  @ApiProperty({ enum: Environment, required: false })
  @IsEnum(Environment)
  @IsNotEmpty()
  environment?: Environment;
}
