import { Body, Controller, Post, Req } from '@nestjs/common';
import { EmailConfirmationService } from './email-confirmation.service';
import { ConfirmationDto } from './dto';
import { SessionService } from '@/modules/session/session.service';
import { Request } from 'express';

@Controller('auth/email-confirmation')
export class EmailConfirmationController {
  constructor(
    private readonly emailConfirmationService: EmailConfirmationService,
    private readonly sessionService: SessionService,
  ) {}

  @Post()
  async newVerification(@Body() dto: ConfirmationDto, @Req() req: Request) {
    const newUser = await this.emailConfirmationService.newVerification(dto);

    return await this.sessionService.saveSession(req, newUser.id);
  }
}
