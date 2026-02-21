import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { SessionService } from '../session/session.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly sessionService: SessionService,
  ) {}

  @Post('register')
  async register(@Body() dto: RegisterDto, @Req() req: Request) {
    const user = await this.authService.register(dto);

    await this.sessionService.saveSession(req, user.id);

    const { password: _password, ...restUser } = user;

    return restUser;
  }

  @Post('login')
  async login(@Body() dto: LoginDto, @Req() req: Request) {
    const user = await this.authService.login(dto);

    await this.sessionService.saveSession(req, user.id);

    const { password: _password, ...restUser } = user;

    return restUser;
  }

  @Post('logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    await this.sessionService.removeSession(req);

    res.clearCookie(this.configService.getOrThrow<string>('SESSION_NAME'));

    return { message: 'Успешный выход из системы' };
  }
}
