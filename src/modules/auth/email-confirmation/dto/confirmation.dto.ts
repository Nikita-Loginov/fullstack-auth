import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class ConfirmationDto {
  @IsNotEmpty({ message: 'Обязателен token' })
  @IsUUID(4, { message: 'Токен должен быть uuid' })
  @IsString({ message: 'Тoken должен быть строчкой' })
  token: string;
}
