import { Body, Controller, HttpCode, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dtos/Login.dto';
import { RegisterDto } from './dtos/Register.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private authServie: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'login' })
  @HttpCode(200)
  login(@Body() body: LoginDto) {
    return this.authServie.login(body);
  }
  @Post('register')
  @ApiOperation({ summary: 'register user' })
  @HttpCode(200)
  register(@Body() body: RegisterDto) {
    return this.authServie.register(body);
  }
}
