import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Role } from '../enums/roles.enum';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AdminOrSameUserGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request?.user?.payload;
    const userId = request.params.id;

    if (user && user.sub === userId) return true;
    return user && user.roles.includes(Role.ADMIN);
  }
}
