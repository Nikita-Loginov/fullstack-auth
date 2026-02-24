import * as React from 'react'

import {
  Body,
  Container,
  Head,
  Link,
  Preview,
  Section,
  Text,
  Html
} from '@react-email/components';

interface ConfirmationTemplateProps {
  domain: string;
  token: string;
};

export const ConfirmationTemplate = ({
  domain,
  token,
}: ConfirmationTemplateProps) => {
  const confirmLink = `${domain}/auth/new-verification?token=${token}`;

  return (
    <Html lang="ru">
      <Head />
      <Preview>Подтвердите ваш email адрес</Preview>

      <Body>
        <Container>
          <Section>
            <Text>Подтверждение email</Text>

            <Text>
              Для подтверждения email адреса перейдите по ссылке ниже:
            </Text>

            <Link href={confirmLink}>Подтвердить email</Link>

            <Text>
              Если вы не регистрировались на нашем сайте, просто проигнорируйте
              это письмо.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};
