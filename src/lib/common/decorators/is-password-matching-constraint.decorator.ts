import { RegisterDto } from '@/modules/auth/dto/register.dto';
import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsPasswordMatching', async: false })
@Injectable()
export class IsPasswordMatching implements ValidatorConstraintInterface {
  validate(
    passwordRepeat: string,
    validationArguments?: ValidationArguments,
  ): boolean {
    const obj = validationArguments.object as RegisterDto;

    return obj.password === passwordRepeat;
  }
  defaultMessage(): string {
    return 'Пароли не совпадают';
  }
}
