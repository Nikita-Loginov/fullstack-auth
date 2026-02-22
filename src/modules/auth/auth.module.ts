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

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'google' }),
    GoogleRecaptchaModule.forRootAsync({
      useFactory: getRecaptchaConfig,
      inject: [ConfigService],
    }),
    UserModule,
    SessionModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy, GithubStrategy],
})
export class AuthModule {}
