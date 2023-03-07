import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  UploadedFiles,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { VenueService } from './venue.service';
import { CreateVenueDto } from './dto/create-venue.dto';
import { UpdateVenueDto } from './dto/update-venue.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { MyFileDto } from './dto/file.dto';
import { MulterError, diskStorage } from 'multer';
import { extname } from 'path';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { QueryParamDto } from './dto/other.dto';

@Controller('venue')
@ApiTags('venue')
export class VenueController {
  constructor(private readonly venueService: VenueService) {}

  // @Post()
  // @ApiOperation({ summary: 'create' })
  // create(@Body() createVenueDto: CreateVenueDto) {
  //   return this.venueService.create(createVenueDto);
  // }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get()
  // @ApiQuery({ type: QueryParamDto, required: false })
  findAll(@Req() req: Request, @Query() filterDto: QueryParamDto) {
    return this.venueService.findAll(req.user, filterDto);
  }

  @Get('public')
  findAllPublic(@Query() filterDto: QueryParamDto) {
    return this.venueService.findAllPublic(filterDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.venueService.findOne(+id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  @ApiOperation({})
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateVenueDto })
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
          destination: './uploads',
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
  update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() updateVenueDto: CreateVenueDto,
  ) {
    return this.venueService.update(req.user, +id, updateVenueDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.venueService.remove(+id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post()
  @ApiOperation({})
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateVenueDto })
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
          destination: './uploads',
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
  create(
    @Req() req: Request,
    @UploadedFiles() coverImage: Express.Multer.File,
    @UploadedFiles() images: Express.Multer.File,
    // @UploadedFiles() files: Express.Multer.File[],
    @Body() body: CreateVenueDto,
  ) {
    // console.log(coverImage, images, body);
    return this.venueService.create(req.user, body);
  }
}
