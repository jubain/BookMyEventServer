import { BadRequestException } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  ConnectedSocket,
  OnGatewayInit,
} from '@nestjs/websockets';
import { VenueBookings } from '@prisma/client';
import { Server, Socket } from 'socket.io';
import { VenueService } from 'src/venue/venue.service';

@WebSocketGateway()
export class VenueGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private venueService: VenueService) {}

  @WebSocketServer()
  public server: Server;

  @SubscribeMessage('bookMessage')
  async handleSendMessage(
    // client: Socket,
    payload:
      | BadRequestException
      | (VenueBookings & {
          Venue: {
            User: {
              id: number;
              name: string;
              email: string;
            };
            name: string;
          };
        }),
  ): Promise<void> {
    this.server.emit('recBookMessage', payload);
  }

  afterInit(server: Server) {
    console.log(server);
  }

  handleConnection(@ConnectedSocket() client: Socket) {
    console.log(`Connected ${client.id}`);
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    console.log(`Disconnected: ${client.id}`);
  }
}
