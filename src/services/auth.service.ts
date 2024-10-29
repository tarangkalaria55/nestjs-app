import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../entities';
import { UsersService } from './users.service';
import { jwtConstants } from '../jwt/jwt-constants';
import { IPayload } from '../jwt';

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

  async verifyToken(token: string) {
    return await this.jwtService.verifyAsync<IPayload>(token, {
      secret: jwtConstants.secret,
    });
  }

  parseToken(token: string) {
    token = token.replace(/^Bearer\s/, '');
    return token;
  }
}
