import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { Role, RoleType } from 'src/auth/role-strategy/roles.decorator';
import { RolesGuard } from 'src/auth/role-strategy/roles.guard';
import { UserService } from './user.service';
import { EditDto } from './dtos/Edit.dto';

@Controller('user')
@ApiTags('user')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
export class UserController {
  constructor(private userService: UserService) {}
  @Get('me')
  @ApiOperation({ summary: 'me' })
  //   @UseGuards(RolesGuard)
  //   @Role(RoleType.CUSTOMER)
  @HttpCode(200)
  getMe(@Req() req: Request) {
    return req.user;
  }

  @Put('me')
  @ApiOperation({ summary: 'editMe' })
  @HttpCode(200)
  editMe(@Req() req: Request, @Body() body: EditDto) {
    return this.userService.editMe(req.user, body);
  }

  @Delete('me')
  @ApiOperation({ summary: 'deleteMe' })
  @HttpCode(200)
  deleteMe(@Req() req: Request) {
    return this.userService.deleteMe(req.user);
  }
}
