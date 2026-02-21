import { UserService } from '@/modules/user/user.service';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const userId = request.session.userId;

    if (!userId) {
      throw new UnauthorizedException('Пользователь не авторизован');
    }

    const user = await this.userService.findById(userId);

    request.user = user;

    return true;
  }
}
