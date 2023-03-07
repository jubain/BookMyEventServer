import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class MyFileDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'File to be uploaded',
  })
  file: Express.Multer.File;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  size: number;
}
