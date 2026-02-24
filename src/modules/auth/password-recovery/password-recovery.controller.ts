import { Body, Controller, Post } from '@nestjs/common';
import { PasswordRecoveryService } from './password-recovery.service';
import { NewPasswordDto, ResetPasswordDto } from './dto';

@Controller('auth/password-recovery')
export class PasswordRecoveryController {
  constructor(
    private readonly passwordRecoveryService: PasswordRecoveryService,
  ) {}

  @Post('reset')
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return await this.passwordRecoveryService.resetPassword(dto);
  }

  @Post('new')
  async newPassword(@Body() dto: NewPasswordDto) {
    return await this.passwordRecoveryService.newPassword(dto);
  }
}
