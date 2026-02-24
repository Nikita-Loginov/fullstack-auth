import * as React from 'react';

import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';
import { ConfigService } from '@nestjs/config';
import { ConfirmationTemplate, ResetPasswordTemplate } from './templates';

@Injectable()
export class MailService {
  private readonly resend: Resend;

  constructor(private readonly configService: ConfigService) {
    this.resend = new Resend(
      configService.getOrThrow<string>('RESEND_API_KEY'),
    );
  }

  async sendVerificationToken(email: string, token: string) {
    const domain = this.configService.getOrThrow<string>('APPLICATION_ORIGIN');

    return this.sendEmail(
      email,
      'Подтверждение email',
      <ConfirmationTemplate domain={domain} token={token} />,
    );
  }

  async sendPasswordEmailToken(email: string, token: string) {
    const domain = this.configService.getOrThrow<string>('APPLICATION_ORIGIN');

    return this.sendEmail(
      email,
      'Восстановление пароля',
      <ResetPasswordTemplate domain={domain} token={token} />,
    );
  }

  sendEmail(to: string, subject: string, react: React.ReactNode) {
    return this.resend.emails.send({
      from: this.configService.getOrThrow<string>('EMAIL_FROM_ADRESS'),
      to,
      subject,
      react,
    });
  }
}
