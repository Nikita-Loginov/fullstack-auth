import * as React from 'react';

import {
  Body,
  Container,
  Head,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface ConfirmationTemplateProps {
  domain: string;
  token: string;
}

export const ConfirmationTemplate = ({
  domain,
  token,
}: ConfirmationTemplateProps) => {
  const confirmLink = `${domain}/auth/new-verification?token=${token}`;

  return (
    <Html lang="ru">
      <Head />
      <Preview>Подтверждение email</Preview>

      <Body>
        <Container>
          <Section>
            <Text>Подтверждение email</Text>

            <Text>
              Для завершения регистрации и подтверждения вашего email-адреса
              перейдите по ссылке ниже:
            </Text>

            <Link href={confirmLink}>Подтвердить email</Link>

            <Text>
              По соображениям безопасности ссылка действительна в течение 1 часа
              с момента отправки письма.
            </Text>

            <Text>
              Если вы не регистрировались на нашем сайте, просто проигнорируйте
              это письмо — никаких действий предпринимать не нужно.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};
