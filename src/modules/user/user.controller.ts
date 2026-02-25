import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import { Authorization, UserCurrent } from '../auth/decorators';
import { User } from 'generated/prisma/client';
import { UpdateProfilerDto } from './dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Authorization()
  @Get('@me')
  getProfile(@UserCurrent() user: User) {
    const { password: _password, ...restUser } = user;

    return restUser;
  }

  @Authorization()
  @Get('by-id/:id')
  async findById(@Param('id') id: string) {
    const { password: _password, ...restUser } =
      await this.userService.findById(id);

    return restUser;
  }

  @Authorization()
  @Patch('@me')
  async updateProfile(
    @UserCurrent() user: User,
    @Body() dto: UpdateProfilerDto,
  ) {
    const { password: _password, ...restUser } =
      await this.userService.updateProfile(user.id, dto);

    return restUser;
  }
}
