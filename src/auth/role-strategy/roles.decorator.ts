import { SetMetadata } from '@nestjs/common';
export enum RoleType {
  CUSTOMER = 'CUSTOMER',
  OWNER = 'OWNER',
}

export const ROLES_KEY = 'roles';
export const Role = (role: RoleType) => SetMetadata('role', role);
