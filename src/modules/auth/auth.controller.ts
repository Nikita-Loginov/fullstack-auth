import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { SessionService } from '../session/session.service';
import { Recaptcha } from '@nestlab/google-recaptcha';
import { AuthGuard } from '@nestjs/passport';
import { getApplicationUrl } from '@/lib/common/utils';
import { UserProvider } from '@/lib/common/interfaces/auth';
import { AuthMethod } from 'generated/prisma/enums';
import { User } from 'generated/prisma/client';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly sessionService: SessionService,
  ) {}

  @Recaptcha({ action: 'register', score: 0.5 })
  @Post('register')
  async register(@Body() dto: RegisterDto, @Req() req: Request) {
    const user = await this.authService.register(dto);

    await this.sessionService.saveSession(req, user.id);

    const { password: _password, ...restUser } = user;

    return restUser;
  }

  @Recaptcha({ action: 'login', score: 0.5 })
  @Post('login')
  async login(@Body() dto: LoginDto, @Req() req: Request) {
    const user = await this.authService.login(dto);

    await this.sessionService.saveSession(req, user.id);

    const { password: _password, ...restUser } = user;

    return restUser;
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @Get('github')
  @UseGuards(AuthGuard('github'))
  async githubAuth() {}

  @Get('oauth/connect/:provider')
  async oauthConnect(
    @Param('provider') provider: AuthMethod,
    @Res() res: Response
  ) {
    const providerUpperCase = provider.toLocaleUpperCase() as AuthMethod;

    const oauthProviders: AuthMethod[] = Object.values(AuthMethod).filter((method) => method !== 'CREDENTIALS');

    if (!oauthProviders.includes(providerUpperCase)) {
      throw new BadRequestException(
        `Не валидный провайдер. Возможные провайдеры: ${oauthProviders.join(', ').toLowerCase()}`
      );
    }

    return res.redirect(`/auth/${provider.toLowerCase()}`);
  }

  @Get('oauth/callback/google')
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(
    @Req() req: Request,
    @Res() res: Response,
    @Query('error') error?: string,
  ) {
    const frontendUrl = this.configService.get<string>('APPLICATION_ORIGIN');

    if (error) {
      res.redirect(`${frontendUrl}/auth/callback?error=${error}`);
    }

    try {
      const googleUser = req.user as UserProvider;

      const user = await this.authService.googleAuthCallback(googleUser, AuthMethod.GOOGLE)

      await this.sessionService.saveSession(req, user.id);

      return res.redirect(`${frontendUrl}/auth/callback?success=true`);
    } catch (error) {
      res.redirect(`${frontendUrl}/auth/callback?error=${error}`);
    }
  }

  @Get('oauth/callback/github')
  @UseGuards(AuthGuard('github'))
  async githubAuthCallback(
    @Req() req: Request,
    @Res() res: Response,
    @Query('error') error?: string,
  ) {
    const frontendUrl = this.configService.get<string>('APPLICATION_ORIGIN');

    if (error) {
      res.redirect(`${frontendUrl}/auth/callback?error=${error}`);
    }

    try {
      const githubUser = req.user as UserProvider;

      const user = await this.authService.googleAuthCallback(githubUser, AuthMethod.GITHUB)

      await this.sessionService.saveSession(req, user.id);

      return res.redirect(`${frontendUrl}/auth/callback?success=true`);
    } catch (error) {
      res.redirect(`${frontendUrl}/auth/callback?error=${error}`);
    }
  }

  @Post('logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    await this.sessionService.removeSession(req);

    res.clearCookie(this.configService.getOrThrow<string>('SESSION_NAME'));

    return { message: 'Успешный выход из системы' };
  }
}
