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

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async register(dto: RegisterDto) {
    const { email, password, name } = dto;

    const isExist = await this.userService.findByEmail(email);

    if (isExist) {
      throw new ConflictException('Пользователь с таким email уже существует');
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

    return user;
  }

  async googleAuthCallback(googleUser: UserProvider, provider: AuthMethod) {
    const user = await this.userService.findOrCreateOAuthUser(
      provider,
      {
        providerId: googleUser.providerId,
        email: googleUser.email,
        displayName: googleUser.displayName,
        picture: googleUser.picture,
        accessToken: googleUser.accessToken,
        refreshToken: googleUser.refreshToken,
      },
    );

    return user
  }
}
