import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { AuthMethod } from 'generated/prisma/enums';

export class ChangePasswordDto {
  @IsNotEmpty({ message: 'Пароль не может быть пустым' })
  @IsString({ message: 'Пароль должен быть строкой' })
  password: string;

  @IsNotEmpty({ message: 'Метод авторизации не может быть пустым' })
  @IsEnum(AuthMethod, {
    message: `Метод авторизации должен быть одним из: ${Object.values(AuthMethod).join(', ')}`,
  })
  method: AuthMethod;
}
