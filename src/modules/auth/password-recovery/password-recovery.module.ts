import { Module } from '@nestjs/common';
import { PasswordRecoveryService } from './password-recovery.service';
import { PasswordRecoveryController } from './password-recovery.controller';
import { UserModule } from '@/modules/user/user.module';
import { SessionModule } from '@/modules/session/session.module';
import { MailModule } from '@/lib/mail/mail.module';
import { TokenModule } from '@/modules/token/token.module';

@Module({
  imports: [UserModule, SessionModule, MailModule, TokenModule],
  controllers: [PasswordRecoveryController],
  providers: [PasswordRecoveryService],
  exports: [PasswordRecoveryService],
})
export class PasswordRecoveryModule {}
