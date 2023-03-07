import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY, Role, RoleType } from './roles.decorator';
import { PrismaClient } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RolesGuard implements CanActivate {
  //   constructor(
  //     private reflector: Reflector,
  //     private prisma: PrismaClient,
  //     private readonly jwtService: JwtService,
  //   ) {}
  constructor(private reflector: Reflector) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRole = this.reflector.get<RoleType>(
      'role',
      context.getHandler(),
    );
    if (!requiredRole) {
      // If the required role is not specified, allow access to the route
      return false;
    }
    console.log(requiredRole, context.switchToHttp().getRequest().user);
    const { user } = context.switchToHttp().getRequest();

    return user.role === requiredRole;
    // if (!userId) {
    //   //   If there is no authenticated user, block access to the route
    //   return false;
    // }

    // // Retrieve the user's role from the database
    // const user = await this.prisma.user.findUnique({
    //   where: {
    //     id: userId,
    //   },
    //   select: {
    //     role: true,
    //   },
    // });

    // // Check if the user's role matches the required role
    // return user.role === requiredRole;
  }
}
