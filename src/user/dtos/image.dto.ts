import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UserAddImageDto {
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
}
