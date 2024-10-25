import { Controller, Get, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AppService } from '../services';
import { CurrentUser, Public } from '../decorators';
import { ICurrentUser } from '../jwt';

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
