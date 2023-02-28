import {
  BadGatewayException,
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDto } from './dtos/Login.dto';
import { RegisterDto } from './dtos/Register.dto';
import * as argon from 'argon2';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
  async login(body: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: body.email },
    });
    if (!user) throw new ForbiddenException('Credential Error!');
    const pwMatches = await argon.verify(user.password, body.password);
    if (!pwMatches) throw new ForbiddenException('Credential Error!');
    delete user.password;
    return user;
  }
  async register(body: RegisterDto) {
    try {
      // generate password
      const hash = await argon.hash(body.password);
      // save the user
      const user = await this.prisma.user.create({
        data: { ...body, password: hash },
        select: { id: true, name: true, email: true, role: true },
      });
      // return the saved user
      return user;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ForbiddenException('Sorry, Email is taken!');
      }

      throw error;
    }
  }
}
