import { Module } from '@nestjs/common';
import { TwoFactorAuthService } from './two-factor-auth.service';
import { MailService } from '@/lib/mail/mail.service';
import { MailModule } from '@/lib/mail/mail.module';

@Module({
  imports: [MailModule],
  providers: [TwoFactorAuthService],
  exports: [TwoFactorAuthService]
})
export class TwoFactorAuthModule {}
