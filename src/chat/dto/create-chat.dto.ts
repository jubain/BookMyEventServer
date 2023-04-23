import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateChatDto {
  user1Id: number;
  user2Id: number;
}

export class CreateRoomDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  user2Id: number;
}
