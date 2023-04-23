import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  ConnectedSocket,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class VenueGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  public server: Server;

  @SubscribeMessage('bookMessage')
  async handleSendMessage(
    // client: Socket,
    payload: any,
  ) {
    this.server.emit('recBookMessage', payload);
  }

  @SubscribeMessage('venueBookingCancelMessage')
  async handleVenueBookingCancelMessage(
    // client: Socket,
    payload: any,
  ) {
    this.server.emit('recVenueBookingCancelMessage', payload);
  }

  @SubscribeMessage('venueBookingDeleteMessage')
  async handleVenueBookingDeleteMessage(
    // client: Socket,
    payload: any,
  ) {
    this.server.emit('recVenueBookingCancelMessage', payload);
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
