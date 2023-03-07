import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { RolesGuard } from 'src/auth/role-strategy/roles.guard';

@Module({
  providers: [UserService, RolesGuard],
  controllers: [UserController],
})
export class UserModule {}
