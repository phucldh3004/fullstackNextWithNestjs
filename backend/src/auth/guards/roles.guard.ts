import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UsersService } from '../../users/users.service';

export enum UserRole {
  ADMIN = 'ADMIN',
  SALES = 'SALES',
  MARKETING = 'MARKETING',
  ACCOUNTANT = 'ACCOUNTANT',
  SUPPORT = 'SUPPORT',
  CUSTOMER = 'CUSTOMER',
}

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => Reflector.createDecorator<string[]>(ROLES_KEY);

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true; // No roles required, allow access
    }

    const request = context.switchToHttp().getRequest();
    const user = request['user'];

    if (!user) {
      return false;
    }

    // Get user details from database to check role
    try {
      const userDetails = await this.usersService.findOne(user.sub);
      return requiredRoles.some((role) => userDetails.role?.toUpperCase().includes(role));
    } catch {
      return false;
    }
  }
}
