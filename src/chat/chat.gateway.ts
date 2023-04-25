import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  ConnectedSocket,
  OnGatewayInit,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { BadRequestException, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';

@WebSocketGateway(8001, { cors: '*' })
export class ChatGateway {
  constructor(
    private readonly chatService: ChatService, // private chatGateway: ChatGateway,
  ) {}
  @WebSocketServer()
  server;

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { roomId: number; message: string },
  ) {
    try {
      const token = client.handshake.headers.authorization.split(' ')[1];
      const user = jwt.verify(token, 'SecretKeyJubeen');
      if (user) {
        const result = await this.chatService.update(
          user,
          body.roomId,
          body.message,
        );
        this.server.emit('getMessage', result);
      }
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Cannot send the message!');
    }
  }
}
