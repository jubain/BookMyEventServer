import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { QueryParamDto } from './dto/others.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { MulterError, diskStorage } from 'multer';
import { extname } from 'path';
import { AddImageDto } from 'src/venue/dto/other.dto';

@ApiTags('events')
@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  create(@Req() req: Request, @Body() createEventDto: CreateEventDto) {
    return this.eventService.create(req.user, createEventDto);
  }

  @Post('/image')
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'coverImage', maxCount: 1 },
        { name: 'images', maxCount: 5 },
      ],
      {
        fileFilter: (req, file, cb) => {
          if (file.originalname.match(/^.*\.(jpg|webp|png|jpeg)$/))
            cb(null, true);
          else {
            cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);
          }
        },
        storage: diskStorage({
          // destination: './uploads',
          filename: (req, file, callback) => {
            const uniqueSuffix =
              Date.now() + '-' + Math.round(Math.random() + 1e9);
            const ext = extname(file.originalname);
            const filename = `${uniqueSuffix}${ext}`;
            callback(null, filename);
          },
        }),
      },
    ),
  )
  addImage(
    @Body() body: AddImageDto,
    @UploadedFiles()
    coverImage: {
      coverImage: {
        fieldname: string;
        originalname: string;
        encoding: string;
        mimetype: string;
        destination: string;
        filename: string;
        path: string;
        size: number;
      }[];
    },
    @UploadedFiles()
    images: {
      images: {
        fieldname: string;
        originalname: string;
        encoding: string;
        mimetype: string;
        destination: string;
        filename: string;
        path: string;
        size: number;
      }[];
    },
  ) {
    return this.eventService.addEventImages(coverImage, images, body);
  }
  @Get()
  findAll(@Query() filterDto: QueryParamDto) {
    return this.eventService.findAll(filterDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventService.findOne(+id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    return this.eventService.update(req.user, +id, updateEventDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  remove(@Req() req: Request, @Param('id') id: string) {
    return this.eventService.remove(req.user, +id);
  }

  @Delete('/image/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  removeImage(@Req() req: Request, @Param('id') id: string) {
    return this.eventService.removeImage(req.user, +id);
  }
}
