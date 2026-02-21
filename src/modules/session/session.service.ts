import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class SessionService {
  async saveSession(req: Request, userId: string) {
    req.session.userId = userId;

    await new Promise<void>((resolve, reject) => {
      req.session.save((err) => {
        if (err) {
          return reject(
            new InternalServerErrorException('Не удалось сохранить сессию'),
          );
        }
        resolve();
      });
    });
  }

  async removeSession(req: Request) {
    await new Promise<void>((resolve, reject) => {
      req.session.destroy((err) => {
        if (err) {
          return reject(
            new InternalServerErrorException('Не удалось удалить сессию'),
          );
        }

        resolve();
      });
    });
  }
}
