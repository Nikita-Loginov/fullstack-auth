import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto, RegisterDto } from './dto';
import { UserService } from '../user/user.service';
import { AuthMethod } from 'generated/prisma/enums';
import { verify } from 'argon2';
import { UserProvider } from '@/lib/common/interfaces/auth';
import { EmailConfirmationService } from './email-confirmation/email-confirmation.service';
import { TwoFactorAuthService } from './two-factor-auth/two-factor-auth.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly emailConfirmationService: EmailConfirmationService,
    private readonly twoFactorAuthService: TwoFactorAuthService,
  ) {}

  async register(dto: RegisterDto) {
    const { email, password, name } = dto;

    const isExistUser = await this.userService.findByEmail(email);

    if (isExistUser) {
      if (isExistUser.method === 'CREDENTIALS') {
        throw new ConflictException(
          'Пользователь с таким email уже существует',
        );
      } else if (isExistUser.password.length === 0) {
        await this.userService.update(isExistUser.id, {
          password,
          method: AuthMethod.CREDENTIALS,
        });

        return await this.userService.findById(isExistUser.id);
      }
    }

    const newUser = await this.userService.create({
      email,
      password,
      displayName: name,
      picture: '',
      method: AuthMethod.CREDENTIALS,
      isVerified: false,
    });

    return newUser;
  }

  async login(dto: LoginDto) {
    const { password } = dto;

    const user = await this.userService.findByEmail(dto.email);

    if (!user || !user.password) {
      throw new UnauthorizedException('Неверный email или пароль');
    }

    const isValidPassword = await verify(user.password, password);

    if (!isValidPassword) {
      throw new UnauthorizedException('Неверный email или пароль');
    }

    const FIVE_MINUTES = 5 * 60 * 1000;

    const lastUpdated = new Date(user.updatedAt).getTime();
    const now = new Date().getTime();

    if (!user.isVerified && now - lastUpdated > FIVE_MINUTES) {
      try {
        await this.emailConfirmationService.sendVerificationToken(user);
      } catch (error) {
        console.error(
          `Ошибка при отправке сообщения на почту для ${user.email}`,
          error,
        );
      }
    }

    if (!user.isVerified) {
      throw new UnauthorizedException(
        'Ваш email не подтвержден. Пожалуйста, проверьте вашу почту и подтвердите email',
      );
    }

    if (user.isTwoFactorEnabled) {
      if (!dto.code) {
        await this.twoFactorAuthService.sendTwoFactorToken(user.email);

        return { type: 'TWO_FACTOR_REQUIRED' };
      }

      await this.twoFactorAuthService.validateTwoFactorToken(
        dto.code,
        user.email,
      );
    }

    return { type: 'SUCCESS', user };
  }

  async googleAuthCallback(googleUser: UserProvider, provider: AuthMethod) {
    const user = await this.userService.findOrCreateOAuthUser(provider, {
      providerId: googleUser.providerId,
      email: googleUser.email,
      displayName: googleUser.displayName,
      picture: googleUser.picture,
      accessToken: googleUser.accessToken,
      refreshToken: googleUser.refreshToken,
    });

    return user;
  }
}
