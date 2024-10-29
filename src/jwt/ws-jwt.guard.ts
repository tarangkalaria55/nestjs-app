import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { AuthService, UsersService } from '../services';
import { User } from 'src/entities';

@Injectable()
export class WsJwtGuard implements CanActivate {
  private logger: Logger = new Logger(WsJwtGuard.name);

  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const socket: Socket = context.switchToWs().getClient<Socket>();

    try {
      const user = await this.authService.validateSocket(socket);

      // socket.join(`house_${user?.house?.id}`);
      context.switchToHttp().getRequest().user = user;

      (context.switchToWs().getClient<Socket>() as any).user = user;

      return Boolean(user);
    } catch (err) {
      throw new WsException(err.message);
    }
  }
}
