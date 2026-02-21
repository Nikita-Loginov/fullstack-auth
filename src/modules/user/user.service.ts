import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateUserDto } from './dto';
import { hash } from 'argon2';
import { AuthMethod } from 'generated/prisma/enums';

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
}
