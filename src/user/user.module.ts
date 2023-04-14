import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { RolesGuard } from 'src/auth/role-strategy/roles.guard';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [UserService, RolesGuard, AuthService, JwtService, PrismaService],
  controllers: [UserController],
  imports: [AuthModule],
})
export class UserModule {}
