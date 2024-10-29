import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../entities';
import { UsersService } from './users.service';
import { jwtConstants } from '../jwt/jwt-constants';
import { IPayload } from '../jwt';
import { Socket } from 'socket.io';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<User | null> {
    const user = await this.usersService.findByUsername(username);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return user;
    }
    return null;
  }

  async createToken(user: User) {
    const payload: IPayload = {
      sub: String(user.userId),
      userId: user.userId,
      username: user.username,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async verifyToken(token: string): Promise<IPayload | undefined | null> {
    if (token.trim() === '') {
      return null;
    }

    const decoded = await this.jwtService.verifyAsync<IPayload>(token, {
      secret: jwtConstants.secret,
    });

    return decoded;
  }

  parseToken(token: string) {
    token = token.replace(/^Bearer\s/, '');
    return token;
  }

  async validateSocket(socket: Socket) {
    const handshake = socket.handshake;

    const bearer_token =
      String(handshake.auth?.token || '').trim() != ''
        ? String(handshake.auth.token)
        : (handshake.headers?.authorization ?? '');

    const token = this.parseToken(bearer_token);

    if (token.trim() == '') {
      throw new Error('Token is empty');
    }

    const payload = await this.verifyToken(token);

    if (!payload) {
      throw new Error('Token is not valid');
    }

    const user = await this.usersService.findByUsername(
      payload?.username ?? '',
    );

    if (!user) {
      throw new Error('User is not valid');
    }

    return user;
  }
}
