import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDto } from './dtos/Login.dto';
import { RegisterDto } from './dtos/Register.dto';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
type StrategyType = 'login' | 'confirmation';
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}
  async login(body: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: body.email },
    });
    if (!user) throw new ForbiddenException('Credential Error!');
    const pwMatches = await argon.verify(user.password, body.password);
    if (!pwMatches) throw new ForbiddenException('Credential Error!');
    return await this.signToken(user.id, user.email, 'login');
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
      return await this.signToken(user.id, user.email, 'confirmation');
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ForbiddenException('Sorry, Email is taken!');
      }

      throw error;
    }
  }

  async signToken(userId: number, email: string, type: StrategyType) {
    const payload = {
      sub: userId,
      email: email,
      type: type,
    };
    const secret = this.config.get('JWT_KEY');
    return {
      token: await this.jwt.signAsync(payload, {
        expiresIn: '1d',
        secret: secret,
      }),
    };
  }
}
