import { PrismaService } from '@/prisma/prisma.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TokenType } from 'generated/prisma/enums';
import { v4 as uuid4 } from 'uuid';
import { NewPasswordDto, ResetPasswordDto } from './dto';
import { UserService } from '@/modules/user/user.service';
import { MailService } from '@/lib/mail/mail.service';
import { hash } from 'argon2';
import { TokenService } from '@/modules/token/token.service';

@Injectable()
export class PasswordRecoveryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly mailService: MailService,
    private readonly tokenServise: TokenService,
  ) {}

  async resetPassword(dto: ResetPasswordDto) {
    const { email } = dto;

    const existingUser = await this.userService.findByEmail(email);

    if (!existingUser) {
      throw new NotFoundException(
        'Пользователь с таким email не найден. Пожалуйста , убедитесь, что вы ввели правильный email',
      );
    }

    const resetPasswordToken = await this.generateResetEmailToken(
      existingUser.email,
    );

    await this.mailService.sendPasswordEmailToken(
      resetPasswordToken.email,
      resetPasswordToken.token,
    );

    return true;
  }

  async newPassword(dto: NewPasswordDto) {
    const { password, token } = dto;

    const existingToken = await this.prisma.token.findUnique({
      where: {
        token,
        type: TokenType.PASSWORD_RESET,
      },
    });

    if (!existingToken) {
      throw new NotFoundException(
        'Токен подтверждения не найден. Пожалуйста, убердитесь , что у вас правильный токен',
      );
    }

    const hasExpired = new Date(existingToken.expiresAt) < new Date();

    if (hasExpired) {
      throw new BadRequestException(
        'Токен подтверждения истек. Пожалуйста, запросите новый токен для подтверждения',
      );
    }

    const existingUser = await this.userService.findByEmail(
      existingToken.email,
    );

    if (!existingUser) {
      throw new NotFoundException(
        'Пользователь с таким email не найден. Пожалуйста , убедитесь, что вы ввели правильный email',
      );
    }

    if (!existingUser.password || existingUser.password.length === 0) {
      await this.tokenServise.deleteToken(existingToken.id);

      return { type: 'oauth', provider: existingUser.method };
    }

    const hashedPassword = await hash(password);

    await this.prisma.user.update({
      where: {
        id: existingUser.id,
      },
      data: {
        password: hashedPassword,
      },
    });

    await this.tokenServise.deleteToken(existingToken.id);

    return { type: 'password' };
  }

  async generateResetEmailToken(email: string) {
    const token = uuid4();
    const expiresAt = new Date(new Date().getTime() + 3600 * 1000);

    await this.prisma.token.findFirst({
      where: {
        email,
        type: TokenType.PASSWORD_RESET,
      },
      select: {
        id: true,
      },
    });

    return this.prisma.token.upsert({
      where: {
        email_type: {
          email,
          type: TokenType.PASSWORD_RESET,
        },
      },
      update: {
        token,
        expiresAt,
      },
      create: {
        email,
        token,
        expiresAt,
        type: TokenType.PASSWORD_RESET,
      },
    });
  }
}
