import { PrismaService } from '@/prisma/prisma.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MailService } from '../../../lib/mail/mail.service';
import { TokenType } from 'generated/prisma/enums';

@Injectable()
export class TwoFactorAuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
  ) {}

  async validateTwoFactorToken(code: string, email: string) {
    const existingToken = await this.prisma.token.findFirst({
      where: {
        email,
        type: TokenType.TWO_FACTOR,
      },
    });

    if (!existingToken) {
      throw new NotFoundException(
        'Код двухфакторной аутентификации не найден. Пожалуйста, запросите новый код',
      );
    }

    if (existingToken.token !== code) {
      throw new BadRequestException(
        'Неверный код двухфакторной аутентификации',
      );
    }

    const hasExpired = new Date(existingToken.expiresAt) < new Date();

    if (hasExpired) {
      throw new BadRequestException(
        'Код двухфакторной аутентификации истёк. Пожалуйста, запросите новый код',
      );
    }

    await this.prisma.token.delete({
      where: { id: existingToken.id },
    });

    return true;
  }

  async sendTwoFactorToken(email: string) {
    const twoFactorToken = await this.generateTwoFactorToken(email);

    await this.mailService.sendTwoFactorEmailToken(
      twoFactorToken.email,
      twoFactorToken.token,
    );

    return true;
  }

  async generateTwoFactorToken(email: string) {
    const token = Math.floor(
      Math.random() * (1000000 - 100000) + 100000,
    ).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await this.prisma.token.findFirst({
      where: {
        email,
        type: TokenType.TWO_FACTOR,
      },
      select: {
        id: true,
      },
    });

    return this.prisma.token.upsert({
      where: {
        email_type: {
          email,
          type: TokenType.TWO_FACTOR,
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
        type: TokenType.TWO_FACTOR,
      },
    });
  }
}
