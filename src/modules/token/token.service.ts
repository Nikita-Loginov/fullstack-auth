import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TokenService {
  constructor(private readonly prisma: PrismaService) {}

  async deleteToken(id: string) {
    await this.prisma.token.delete({
      where: { id },
    });
  }
}
