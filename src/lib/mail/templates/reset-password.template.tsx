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

interface ResetPasswordTemplateProps {
  domain: string;
  token: string;
}

export const ResetPasswordTemplate = ({
  domain,
  token,
}: ResetPasswordTemplateProps) => {
  const resetLink = `${domain}/auth/new-password?token=${token}`;


  return (
    <Html lang="ru">
      <Head />
      <Preview>Восстановление пароля</Preview>

      <Body>
        <Container>
          <Section>
            <Text>Восстановление пароля</Text>

            <Text>
              Мы получили запрос на восстановление пароля для вашего аккаунта.
            </Text>

            <Text>Чтобы задать новый пароль, перейдите по ссылке ниже:</Text>

            <Link href={resetLink}>Сбросить пароль</Link>

            <Text>
              По соображениям безопасности ссылка действительна в течение 1 часа
              с момента отправки письма.
            </Text>

            <Text>
              Если вы не запрашивали восстановление пароля, просто
              проигнорируйте это письмо — никаких действий предпринимать не
              нужно.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};
