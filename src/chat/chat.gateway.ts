import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { BadRequestException } from '@nestjs/common';

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
