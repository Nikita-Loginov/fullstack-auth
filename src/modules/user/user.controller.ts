import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { Authorization, UserCurrent } from '../auth/decorators';
import { User } from 'generated/prisma/client';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Authorization()
  @Get('@me')
  getProfile(@UserCurrent() user: User) {
    const { password: _password, ...restUser } = user;

    return restUser;
  }
}
