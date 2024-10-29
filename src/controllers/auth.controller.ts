import { Controller, Post, Body, NotFoundException } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../services';
import { Public } from '../decorators';
import { LoginDto } from '../dto';

@ApiTags('auth')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(
      loginDto.username,
      loginDto.password,
    );
    if (!user) {
      throw new NotFoundException();
    }

    var result = await this.authService.createToken(user);

    var a = await this.authService.verifyToken(result.access_token);

    return result;
  }
}
