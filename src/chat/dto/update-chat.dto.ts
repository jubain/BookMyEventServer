import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateChatDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  message: string;
}
