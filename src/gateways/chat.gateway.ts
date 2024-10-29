import { Logger } from '@nestjs/common';
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AddMessageDto } from '../dto';
import { AuthService } from '../services';

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private logger = new Logger('ChatGateway');

  @WebSocketServer()
  server: Server;

  constructor(private authService: AuthService) {}

  handleConnection(socket: Socket, ...args: any[]) {
    const bearer_token = socket.handshake.headers.authorization;
    const token = this.authService.parseToken(bearer_token);
    this.authService.verifyToken(token);

    this.logger.log(`Socket connected: ${socket.id}`);
  }

  handleDisconnect(socket: Socket) {
    this.logger.log(`Socket disconnected: ${socket.id}`);
  }

  @SubscribeMessage('chat') // subscribe to chat event messages
  handleMessage(@MessageBody() payload: AddMessageDto): AddMessageDto {
    this.logger.log(`Message received: ${payload.author} - ${payload.body}`);
    this.server.emit('chat', payload); // broadbast a message to all clients
    return payload; // return the same payload data
  }
}
