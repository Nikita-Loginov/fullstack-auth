import * as React from 'react';

import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface TwoFactorTemplateProps {
  token: string;
}

export const TwoFactorTemplate = ({ token }: TwoFactorTemplateProps) => {
  return (
    <Html lang="ru">
      <Head />
      <Preview>Код двухфакторной аутентификации</Preview>

      <Body>
        <Container>
          <Section>
            <Text>Двухфакторная аутентификация</Text>

            <Text>
              Мы обнаружили попытку входа в ваш аккаунт. Для подтверждения
              личности введите в сервисе код: <strong>{token}</strong>
            </Text>

            <Text>
              Код действителен в течение <strong>15 минут</strong> с момента
              отправки письма.
            </Text>

            <Text>
              Если вы не пытались войти в аккаунт, просто проигнорируйте это
              письмо — никаких действий предпринимать не нужно.
            </Text>

            <Text>
              Никому не сообщайте этот код. Сотрудники сервиса никогда не
              запрашивают коды подтверждения.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};
