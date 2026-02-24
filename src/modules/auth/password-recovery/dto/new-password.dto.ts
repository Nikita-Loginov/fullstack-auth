import { IsNotEmpty, IsString, IsUUID, MinLength } from 'class-validator';

export class NewPasswordDto {
  @MinLength(6, { message: 'Пароль должен содержать минимум 6 символов' })
  @IsString({ message: 'Пароль должен быть строкой' })
  @IsNotEmpty({ message: 'Пароль не может быть пустым' })
  password: string;

  @IsNotEmpty({ message: 'Обязателен token' })
  @IsUUID(4, { message: 'Токен должен быть uuid' })
  @IsString({ message: 'Тoken должен быть строчкой' })
  token: string;
}
