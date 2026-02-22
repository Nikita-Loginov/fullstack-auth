import { ConfigService } from '@nestjs/config';

export const getApplicationUrl = (configService: ConfigService): string => {
  const port = configService.get<string>('APPLICATION_URL');

  return `http://localhost:${port}`;
};
