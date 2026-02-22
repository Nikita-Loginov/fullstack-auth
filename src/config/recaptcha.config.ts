import { isDev } from '@/lib/common/utils';
import { ConfigService } from '@nestjs/config';
import { GoogleRecaptchaModuleOptions } from '@nestlab/google-recaptcha';
import { Request } from 'express';

export const getRecaptchaConfig = (
  configService: ConfigService,
): GoogleRecaptchaModuleOptions => ({
  secretKey: configService.getOrThrow<string>('GOOGLE_RECAPTCHA_SECRET_KEY'),
  response: (req: Request) => {
    const recaptcha = req.headers.recaptcha;

    return Array.isArray(recaptcha) ? recaptcha[0] : recaptcha || '';
  },
  skipIf: isDev(configService),
  score: 0.5,
});
