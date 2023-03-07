import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, Matches } from 'class-validator';
import { CreateVenueDto, Environment, Wifi } from './create-venue.dto';

export class UpdateVenueDto {
  @ApiProperty({ type: 'string', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  type?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @Matches(/^\d+$/, { message: 'Must be a number!' })
  price?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  address1?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  address2?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  postcode?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  country?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @Matches(
    /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi,
    { message: 'Should be valid website' },
  )
  website?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @Matches(/^\d+$/, { message: 'Must be a number!' })
  people?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @Matches(/^\d+$/, { message: 'Must be a number!' })
  toilets?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @Matches(/^\d+$/, { message: 'Must be a number!' })
  chairs?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @Matches(/^\d+$/, { message: 'Must be a number!' })
  tables?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @Matches(/^\d+$/, { message: 'Must be a number!' })
  kitchens?: string;

  @ApiProperty({ enum: Wifi, required: false })
  @IsEnum(Wifi)
  @IsOptional()
  wifi?: Wifi;

  @ApiProperty({ enum: Environment, required: false })
  @IsEnum(Environment)
  @IsOptional()
  environment?: Environment;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'File to be uploaded',
    required: false,
  })
  @IsOptional()
  coverImage?: Express.Multer.File;

  @ApiProperty({
    type: 'array',
    items: {
      type: 'string',
      format: 'binary',
    },
    description: 'Files to be uploaded',
    required: false,
  })
  @IsOptional()
  images?: Express.Multer.File[];
}
