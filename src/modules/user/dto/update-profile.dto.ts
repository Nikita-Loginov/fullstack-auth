import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateProfilerDto {
  @IsNotEmpty({ message: 'Отображаемое имя не может быть пустым' })
  @IsString({ message: 'Отображаемое имя (displayName) должно быть строкой' })
  @IsOptional()
  displayName: string;

  @IsNotEmpty({ message: 'Email не может быть пустым' })
  @IsString({ message: 'Email должен быть строкой' })
  @IsEmail({}, { message: 'Некорректный формат email' })
  @IsOptional()
  email?: string;

  @IsString({ message: 'Ссылка на изображение должна быть строкой' })
  @IsOptional()
  picture: string;

  @IsNotEmpty({ message: 'Статус двухфакторной не может быть пустым' })
  @IsBoolean({ message: 'isTwoFactorEnabled должен быть boolean' })
  @IsOptional()
  isTwoFactorEnabled: boolean;
}
