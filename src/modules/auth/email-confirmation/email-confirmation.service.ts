import { PrismaService } from '@/prisma/prisma.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Request } from 'express';
import { TokenType } from 'generated/prisma/enums';
import { v4 as uuid4 } from 'uuid';
import { ConfirmationDto } from './dto';
import { UserService } from '../../user/user.service';
import { User } from 'generated/prisma/client';
import { MailService } from '../../../lib/mail/mail.service';

@Injectable()
export class EmailConfirmationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly mailService: MailService
  ) {}

  async newVerification(dto: ConfirmationDto) {
    const { token } = dto;

    
    const existingToken = await this.prisma.token.findUnique({
      where: {
        token,
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

    const existingUser = await this.userService.findByEmail(existingToken.email);

    if (!existingUser) {
      throw new NotFoundException(
        'Пользователь с таким email не найден. Пожалуйста , убедитесь, что вы ввели правильный email',
      );
    }

    return await this.prisma.user.update({
      where: {
        id: existingUser.id,
      },
      data: {
        isVerified: true,
      },
    });
  }

  async sendVerificationToken(user: User) {
    const verificationToken = await this.generateVerificationToken(user.email);

    await this.mailService.sendVerificationToken(verificationToken.email,  verificationToken.token)

    return true
  }

  async generateVerificationToken(email: string) {
    const token = uuid4();
    const expiresAt = new Date(new Date().getTime() + 3600 * 1000);

    const existingToken = await this.prisma.token.findFirst({
      where: {
        email,
        type: TokenType.VERIFICATION,
      },
      select: {
        id: true,
      },
    });

    if (existingToken) {
      await this.prisma.token.delete({
        where: {
          id: existingToken.id,
        },
      });
    }

    const verificationToken =await this.prisma.token.create({
      data: {
        email,
        token,
        expiresAt,
        type: TokenType.VERIFICATION,
      },
    });

    return verificationToken;
  }
}
