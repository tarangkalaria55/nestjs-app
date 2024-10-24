import {
  Controller,
  Get,
  Post,
  Request,
  Body,
  NotFoundException,
} from '@nestjs/common';
import { LoginDto } from '../dto/login.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../decorators/current-user.decorator';
import { Public } from '../decorators/public.decorator';
import { AppService } from '../services/app.service';
import { AuthService } from '../services/auth.service';
import { ICurrentUser } from 'src/jwt/current-user.interface';

@ApiTags()
@ApiBearerAuth()
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private authService: AuthService,
  ) {}

  @Public()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Public()
  @Post('auth/login')
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(
      loginDto.username,
      loginDto.password,
    );
    if (!user) {
      throw new NotFoundException();
    }
    return this.authService.login(user);
  }

  @Get('profile')
  getProfile(@Request() req, @CurrentUser() user?: ICurrentUser) {
    return { requser: req.user, user: user };
  }
}
