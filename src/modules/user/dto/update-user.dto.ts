import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { AuthMethod } from 'generated/prisma/enums';

export class UpdateUserDto {
  @IsNotEmpty({ message: 'Email не может быть пустым' })
  @IsString({ message: 'Email должен быть строкой' })
  @IsOptional()
  email?: string;

  @IsNotEmpty({ message: 'Пароль не может быть пустым' })
  @IsString({ message: 'Пароль должен быть строкой' })
  @IsOptional()
  password?: string;

  @IsNotEmpty({ message: 'Отображаемое имя не может быть пустым' })
  @IsString({ message: 'Отображаемое имя (displayName) должно быть строкой' })
  @IsOptional()
  displayName?: string;

  @IsOptional()
  @IsString({ message: 'Ссылка на изображение должна быть строкой' })
  @IsOptional()
  picture?: string;

  @IsNotEmpty({ message: 'Метод авторизации не может быть пустым' })
  @IsEnum(AuthMethod, {
    message: `Метод авторизации должен быть одним из: ${Object.values(AuthMethod).join(', ')}`,
  })
  @IsOptional()
  method?: AuthMethod;

  @IsNotEmpty({ message: 'Статус верификации не может быть пустым' })
  @IsBoolean({ message: 'isVerified должен быть boolean' })
  @IsOptional()
  isVerified?: boolean;
}
