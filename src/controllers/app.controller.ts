import { Controller, Get, Request } from '@nestjs/common';
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
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('profile')
  getProfile(@Request() req, @CurrentUser() user?: ICurrentUser) {
    return { requser: req.user, user: user };
  }
}
