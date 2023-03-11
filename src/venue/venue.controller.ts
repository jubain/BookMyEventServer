import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  UseGuards,
  Req,
  Query,
  Render,
} from '@nestjs/common';
import { VenueService } from './venue.service';
import { CreateVenueDto } from './dto/create-venue.dto';
import { UpdateVenueDto } from './dto/update-venue.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { MulterError, diskStorage } from 'multer';
import { extname } from 'path';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { FindVenueDto, QueryParamDto } from './dto/other.dto';
import { CreateVenueBookingDto } from './dto/createBooking.dto';
import { VenueGateway } from './venue.gateway';

@Controller('venue')
@ApiTags('venue')
export class VenueController {
  constructor(
    private readonly venueService: VenueService,
    private venueGateway: VenueGateway,
  ) {}

  @Get('index')
  @Render('index')
  root() {
    return { message: 'hello' };
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll(@Req() req: Request, @Query() filterDto: QueryParamDto) {
    return this.venueService.findAll(req.user, filterDto);
  }

  @Post('public')
  findAllPublic(@Query() filterDto: QueryParamDto, @Body() body: FindVenueDto) {
    return this.venueService.findAllPublic(filterDto, body);
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
    @Body() body: CreateVenueDto,
  ) {
    return this.venueService.create(req.user, body);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('/booking')
  async createBooking(
    @Req() req: Request,
    @Body() body: CreateVenueBookingDto,
  ) {
    return await this.venueService
      .createBooking(req.user, body)
      .then((venue) => {
        this.venueGateway.handleSendMessage(venue);
        return venue;
      })
      .catch((err) => {
        return err;
      });
  }
}
