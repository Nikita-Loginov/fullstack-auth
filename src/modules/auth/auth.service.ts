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

    return user;
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
