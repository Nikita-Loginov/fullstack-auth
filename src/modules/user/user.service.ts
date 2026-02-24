import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto';
import { hash } from 'argon2';
import { AuthMethod } from 'generated/prisma/enums';
import { UserProvider } from '@/lib/common/interfaces/auth';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        id,
      },
      include: {
        accounts: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Такого пользователя нет');
    }

    return user;
  }

  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        accounts: true,
      },
    });

    return user;
  }

  async create(dto: CreateUserDto) {
    const { password } = dto;

    const hashedPassword =
      dto.method === AuthMethod.CREDENTIALS && password
        ? await hash(password)
        : null;

    const user = await this.prisma.user.create({
      data: {
        ...dto,
        password: hashedPassword,
      },
      include: {
        accounts: true,
      },
    });

    return user;
  }

  async update(userId: string, dto: UpdateUserDto) {
    const hashedPassword = dto.password ? await hash(dto.password) : null;

    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...dto,
        password: hashedPassword,
      },
      include: {
        accounts: true,
      },
    });

    return user;
  }

  async findOrCreateOAuthUser(
    provider: AuthMethod,
    userProvider: UserProvider,
  ) {
    const {
      email,
      displayName,
      picture,
      providerId,
      accessToken,
      refreshToken,
    } = userProvider;

    if (!email) {
      throw new BadRequestException(
        'Для аутентификации через OAuth требуется указать адрес электронной почты.',
      );
    }

    if (!providerId) {
      throw new BadRequestException(
        'Для аутентификации через OAuth требуется providerId.',
      );
    }

    let user = await this.prisma.user.findFirst({
      where: {
        accounts: {
          some: {
            provider,
            providerId,
          },
        },
      },
      include: {
        accounts: true,
      },
    });

    if (!user) {
      user = await this.prisma.user.findUnique({
        where: {
          email,
        },
        include: {
          accounts: true,
        },
      });
    }

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email,
          displayName: displayName || email.split('@')[0],
          picture: picture || null,
          password: '',
          method: provider,
          isVerified: true,
          accounts: {
            create: {
              provider,
              type: 'oauth',
              providerId,
              accessToken: accessToken || '',
              refreshToken: refreshToken || null,
              expiresAt: Math.floor(Date.now() / 1000) + 3600,
            },
          },
        },
        include: { accounts: true },
      });
    } else {
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          displayName: displayName || user.displayName,
          picture: picture || user.picture,
          method: provider,
        },
      });

      const existingAccount = user.accounts?.find(
        (acc) => acc.provider === provider,
      );

      if (existingAccount) {
        await this.prisma.account.update({
          where: { id: existingAccount.id },
          data: {
            providerId,
            accessToken: accessToken || existingAccount.accessToken,
            refreshToken: refreshToken || existingAccount.refreshToken,
            expiresAt: Math.floor(Date.now() / 1000) + 3600,
          },
        });
      } else {
        await this.prisma.account.create({
          data: {
            provider,
            type: 'oauth',
            providerId,
            accessToken: accessToken || '',
            refreshToken: refreshToken || null,
            expiresAt: Math.floor(Date.now() / 1000) + 3600,
            userId: user.id,
          },
        });
      }
    }

    return user;
  }
}
