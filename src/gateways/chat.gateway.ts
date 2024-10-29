import { Logger, UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AddMessageDto } from '../dto';
import { AuthService, UsersService } from '../services';
import { WsJwtGuard } from '../jwt';
import { from, map, Observable } from 'rxjs';

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private logger = new Logger('ChatGateway');

  @WebSocketServer()
  server: Server;

  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  async handleConnection(socket: Socket, ...args: any[]) {
    try {
      const user = await this.authService.validateSocket(socket);

      this.logger.log(`Socket connected: ${socket.id}`);
    } catch (e) {
      socket.disconnect();
    }
  }

  handleDisconnect(socket: Socket) {
    this.logger.log(`Socket disconnected: ${socket.id}`);
  }

  private afterConnect() {}

  private beforeDisconnect() {}

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('events')
  findAll(
    @MessageBody() data: any,
    @ConnectedSocket() socket: Socket,
  ): Observable<WsResponse<number>> {
    return from([1, 2, 3]).pipe(
      map((item) => ({ event: 'events', data: item })),
    );
  }

  @SubscribeMessage('identity')
  async identity(@MessageBody() data: number): Promise<number> {
    return data;
  }
}
