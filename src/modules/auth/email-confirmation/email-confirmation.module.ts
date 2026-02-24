import { Module } from '@nestjs/common';
import { EmailConfirmationService } from './email-confirmation.service';
import { EmailConfirmationController } from './email-confirmation.controller';
import { UserModule } from '@/modules/user/user.module';
import { SessionModule } from '@/modules/session/session.module';
import { MailModule } from '@/lib/mail/mail.module';

@Module({
  imports: [UserModule, SessionModule, MailModule],
  controllers: [EmailConfirmationController],
  providers: [EmailConfirmationService],
  exports: [EmailConfirmationService],
})
export class EmailConfirmationModule {}
