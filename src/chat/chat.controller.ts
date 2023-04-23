import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { UpdateChatDto } from './dto/update-chat.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { CreateRoomDto } from './dto/create-chat.dto';
import { ChatGateway } from './chat.gateway';

@Controller('chat')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('chats')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private chatGateway: ChatGateway,
  ) {}

  @Post()
  create(@Req() req: Request, @Body() body: CreateRoomDto) {
    return this.chatService.create(req.user, body.user2Id);
  }

  @Get('getChats')
  findAll(@Req() req: Request) {
    return this.chatService.findAll(req.user);
  }

  // @Post('getChat')
  // findOneChat(@Req() req: Request, @Body body: CreateRoomDto) {
  //   return this.chatService.findOneChat(req.user, body);
  // }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chatService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() updateChatDto: UpdateChatDto,
  ) {
    return this.chatService
      .update(req.user, +id, updateChatDto)
      .then((chat) => {
        this.chatGateway.handleSendMessage(chat);
        return chat;
      })
      .catch((err) => err);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chatService.remove(+id);
  }
}
