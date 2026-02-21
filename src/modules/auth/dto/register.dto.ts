import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  Validate,
} from 'class-validator';
import { IsPasswordMatching } from '@/lib/common/decorators';

export class RegisterDto {
  @IsString({ message: 'Имя должно быть строкой' })
  @IsNotEmpty({ message: 'Имя не может быть пустым' })
  name: string;

  @IsString({ message: 'Email должен быть строкой' })
  @IsEmail({}, { message: 'Некорректный формат email' })
  @IsNotEmpty({ message: 'Email не может быть пустым' })
  email: string;

  @MinLength(6, { message: 'Пароль должен содержать минимум 6 символов' })
  @IsString({ message: 'Пароль должен быть строкой' })
  @IsNotEmpty({ message: 'Пароль не может быть пустым' })
  password: string;

  @Validate(IsPasswordMatching, {
    message: 'Пароли не совпадают',
  })
  @MinLength(6, {
    message: 'Повтор пароля должен содержать минимум 6 символов',
  })
  @IsString({ message: 'Повтор пароля должен быть строкой' })
  @IsNotEmpty({ message: 'Повтор пароля не может быть пустым' })
  passwordRepeat: string;
}
