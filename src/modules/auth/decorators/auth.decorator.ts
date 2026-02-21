import { applyDecorators, UseGuards } from '@nestjs/common';
import { UserRole } from 'generated/prisma/enums';
import { Roles } from './roles.decorator';
import { AuthGuard, RolesGuard } from '../guards';

export const Authorization = (...roles: UserRole[]) => {
  if (roles.length > 0) {
    return applyDecorators(Roles(...roles), UseGuards(AuthGuard, RolesGuard));
  }

  return applyDecorators(UseGuards(AuthGuard));
};
