import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { SessionModule } from '../session/session.module';
import { getRecaptchaConfig } from '@/config';
import { GoogleRecaptchaModule } from '@nestlab/google-recaptcha';
import { ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { GoogleStrategy, GithubStrategy } from '@/strategies';
import { EmailConfirmationModule } from './email-confirmation/email-confirmation.module';
import { PasswordRecoveryModule } from './password-recovery/password-recovery.module';
import { TokenModule } from '../token/token.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'google' }),
    GoogleRecaptchaModule.forRootAsync({
      useFactory: getRecaptchaConfig,
      inject: [ConfigService],
    }),
    UserModule,
    SessionModule,
    EmailConfirmationModule,
    PasswordRecoveryModule,
    TokenModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy, GithubStrategy],
})
export class AuthModule {}
