import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { RolesGuard } from 'src/auth/role-strategy/roles.guard';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { S3Module } from 'src/s3/s3.module';
import { S3FileService } from 'src/s3/file.service';
import { S3Service } from 'src/s3/s3.service';

@Module({
  providers: [
    UserService,
    RolesGuard,
    AuthService,
    JwtService,
    PrismaService,
    S3FileService,
    S3Service,
  ],
  controllers: [UserController],
  imports: [AuthModule, S3Module],
})
export class UserModule {}
