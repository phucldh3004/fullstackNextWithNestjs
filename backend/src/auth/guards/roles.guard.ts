import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UsersService } from '../../users/users.service';
import { SetMetadata } from '@nestjs/common';

export enum UserRole {
  ADMIN = 'ADMIN',
  SALES = 'SALES',
  MARKETING = 'MARKETING',
  ACCOUNTANT = 'ACCOUNTANT',
  SUPPORT = 'SUPPORT',
  CUSTOMER = 'CUSTOMER',
  USER = 'USER',
}

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);

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

    console.log('🛡️ RolesGuard Debug:', {
      userId: user.id,
      user: user,
      requiredRoles,
    });

    // Get user details from database to check role
    try {
      if (!user.sub) {
         console.error('🛡️ RolesGuard Error: User ID (sub) is missing in JWT payload. The token might be old or malformed.');
         return false;
      }
      const userDetails = await this.usersService.findOne(user.sub);
   
      return requiredRoles.some((role) => userDetails.role?.toUpperCase().includes(role));
    } catch (error) {
      console.error('🛡️ RolesGuard Error:', error);
      return false;
    }
  }
}
