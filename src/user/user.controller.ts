import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { Role, RoleType } from 'src/auth/role-strategy/roles.decorator';
import { RolesGuard } from 'src/auth/role-strategy/roles.guard';
import { UserService } from './user.service';
import { EditDto } from './dtos/Edit.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterError, diskStorage } from 'multer';
import { extname } from 'path';
import { UserAddImageDto } from './dtos/image.dto';

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
    return this.userService.getMe(req.user);
  }

  @Get('/:id')
  getUserById(@Param('id') id: string) {
    return this.userService.getUserById(+id);
  }

  @Patch('me')
  @ApiOperation({ summary: 'editMe' })
  @HttpCode(200)
  editMe(@Req() req: Request, @Body() body: EditDto) {
    return this.userService.editMe(req.user, body);
  }

  @Post('/image')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('image', {
      fileFilter: (req, file, cb) => {
        if (file.originalname.match(/^.*\.(jpg|webp|png|jpeg)$/))
          cb(null, true);
        else {
          cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);
        }
      },
      storage: diskStorage({
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() + 1e9);
          const ext = extname(file.originalname);
          const filename = `${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
    }),
  )
  addImage(
    @Req() req: Request,
    @Body() body: UserAddImageDto,
    @UploadedFile()
    image: Express.Multer.File,
  ) {
    return this.userService.addUserImages(req.user, image);
  }

  @Delete('me')
  @ApiOperation({ summary: 'deleteMe' })
  @HttpCode(200)
  deleteMe(@Req() req: Request) {
    return this.userService.deleteMe(req.user);
  }

  @Get('bookings')
  @HttpCode(200)
  getBookings(@Req() req: Request) {
    return this.userService.getBookings(req.user);
  }

  @Get('hostings')
  @HttpCode(200)
  getHostings(@Req() req: Request) {
    return this.userService.getHostings(req.user);
  }
}
