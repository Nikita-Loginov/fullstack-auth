import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { AuthMethod } from 'generated/prisma/enums';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Email не может быть пустым' })
  @IsString({ message: 'Email должен быть строкой' })
  email: string;

  @IsNotEmpty({ message: 'Пароль не может быть пустым' })
  @IsString({ message: 'Пароль должен быть строкой' })
  password: string;

  @IsNotEmpty({ message: 'Отображаемое имя не может быть пустым' })
  @IsString({ message: 'Отображаемое имя (displayName) должно быть строкой' })
  displayName: string;

  @IsOptional()
  @IsString({ message: 'Ссылка на изображение должна быть строкой' })
  picture?: string;

  @IsNotEmpty({ message: 'Метод авторизации не может быть пустым' })
  @IsEnum(AuthMethod, {
    message: `Метод авторизации должен быть одним из: ${Object.values(AuthMethod).join(', ')}`,
  })
  method: AuthMethod;

  @IsNotEmpty({ message: 'Статус верификации не может быть пустым' })
  @IsBoolean({ message: 'isVerified должен быть boolean' })
  isVerified: boolean;
}
