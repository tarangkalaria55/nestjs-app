import {
  Controller,
  Get,
  Header,
  Logger,
  Request,
  StreamableFile,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AppService } from '../services';
import { CurrentUser, Public } from '../decorators';
import { ICurrentUser } from '../jwt';
import { createReadStream } from 'fs';
import { join } from 'path';

@ApiTags()
@ApiBearerAuth()
@Controller()
export class AppController {
  private readonly logger = new Logger('AppController');

  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  getHello(): string {
    this.logger.log('Doing something with timestamp here ->');
    return this.appService.getHello();
  }

  @Public()
  @Get('file')
  @Header('Content-Type', 'application/json')
  @Header('Content-Disposition', 'attachment; filename="package.json"')
  getFileUsingStaticValues(): StreamableFile {
    const file = createReadStream(join(process.cwd(), 'package.json'));
    return new StreamableFile(file);
  }

  @Get('profile')
  getProfile(@Request() req, @CurrentUser() user?: ICurrentUser) {
    return { requser: req.user, user: user };
  }
}
