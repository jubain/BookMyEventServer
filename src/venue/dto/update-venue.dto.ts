import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { CreateVenueDto, Environment, Wifi } from './create-venue.dto';

export class UpdateVenueDto {
  @ApiProperty({ type: 'string', required: false })
  @IsString()
  @IsOptional({ always: true })
  name?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional({ always: true })
  description?: string;

  @ApiProperty({ required: false })
  @IsArray()
  @IsOptional({ always: true })
  type?: number[];

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional({ always: true })
  // @Matches(/^\d+$/, { message: 'Must be a number!' })
  price?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional({ always: true })
  address1?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional({ always: true })
  address2?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional({ always: true })
  city?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional({ always: true })
  postcode?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional({ always: true })
  country?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional({ always: true })
  @Matches(
    /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi,
    { message: 'Should be valid website' },
  )
  website?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional({ always: true })
  // @Matches(/^\d+$/, { message: 'Must be a number!' })
  people?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional({ always: true })
  // @Matches(/^\d+$/, { message: 'Must be a number!' })
  toilets?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional({ always: true })
  // @Matches(/^\d+$/, { message: 'Must be a number!' })
  chairs?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional({ always: true })
  // @Matches(/^\d+$/, { message: 'Must be a number!' })
  tables?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional({ always: true })
  // @Matches(/^\d+$/, { message: 'Must be a number!' })
  kitchens?: number;

  @ApiProperty({ enum: Wifi, required: false })
  @IsEnum(Wifi)
  @IsOptional({ always: true })
  wifi?: Wifi;

  @ApiProperty({ enum: Environment, required: false })
  @IsEnum(Environment)
  @IsOptional({ always: true })
  environment?: Environment;
}
