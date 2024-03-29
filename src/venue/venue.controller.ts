import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UseGuards,
  Req,
  Query,
  Render,
  UploadedFile,
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
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterError, diskStorage } from 'multer';
import { extname } from 'path';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { AddImageDto, FindVenueDto, QueryParamDto } from './dto/other.dto';
import { CreateVenueBookingDto } from './dto/createBooking.dto';
// import { VenueGateway } from './venue.gateway';

@Controller('venue')
@ApiTags('venue')
export class VenueController {
  constructor(
    private readonly venueService: VenueService, // private venueGateway: VenueGateway,
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

  @Post('/image')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
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
    @Body() body: AddImageDto,
    @UploadedFile()
    image: Express.Multer.File,
  ) {
    console.log(image);
    // console.log(coverImage, extraImages);
    return this.venueService.addVenueImages(image, body);
  }

  @Get('images')
  findImages() {
    return this.venueService.findImages();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.venueService.findOne(+id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() updateVenueDto: UpdateVenueDto,
  ) {
    return this.venueService.update(req.user, +id, updateVenueDto);
  }

  @Delete('deleteImage/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  deleteImages(@Param('id') id: string) {
    this.venueService.deleteVenueImages(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Request) {
    return this.venueService.remove(+id, req.user);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post()
  @ApiOperation({})
  // @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateVenueDto })
  // @UseInterceptors(
  //   FileFieldsInterceptor(
  //     [
  //       { name: 'coverImage', maxCount: 1 },
  //       { name: 'images', maxCount: 5 },
  //     ],
  //     {
  //       fileFilter: (req, file, cb) => {
  //         if (file.originalname.match(/^.*\.(jpg|webp|png|jpeg)$/))
  //           cb(null, true);
  //         else {
  //           cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);
  //         }
  //       },
  //       storage: diskStorage({
  //         // destination: './uploads',
  //         filename: (req, file, callback) => {
  //           const uniqueSuffix =
  //             Date.now() +
  //             '-' +
  //             Math.round(Math.random() + 1e2) +
  //             '-' +
  //             file.originalname.split('.')[0];
  //           const ext = extname(file.originalname);
  //           const filename = `${uniqueSuffix}${ext}`;
  //           callback(null, filename);
  //         },
  //       }),
  //     },
  //   ),
  // )
  create(
    @Req() req: Request,
    // @UploadedFiles()
    // coverImage: {
    //   coverImage: {
    //     fieldname: string;
    //     originalname: string;
    //     encoding: string;
    //     mimetype: string;
    //     destination: string;
    //     filename: string;
    //     path: string;
    //     size: number;
    //   }[];
    // },
    // @UploadedFiles()
    // images: {
    //   images: {
    //     fieldname: string;
    //     originalname: string;
    //     encoding: string;
    //     mimetype: string;
    //     destination: string;
    //     filename: string;
    //     path: string;
    //     size: number;
    //   }[];
    // },
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
    return await this.venueService.createBooking(req.user, body);
    // .then((venue) => {
    //   this.venueGateway.handleSendMessage(venue);
    //   return venue;
    // })
    // .catch((err) => {
    //   return err;
    // });
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Patch('/cancelBooking/:id')
  async cancelBooking(@Param('id') id: string, @Req() req: Request) {
    return await this.venueService.cancelRequestBooking(+id, req.user);
    // .then((booking) => {
    //   this.venueGateway.handleVenueBookingCancelMessage(booking);
    //   return booking;
    // })
    // .catch((err) => {
    //   return err;
    // });
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete('/deleteBooking/:id')
  async deleteBooking(@Param('id') id: string, @Req() req: Request) {
    return await this.venueService.deleteBooking(+id, req.user);
    // .then((booking) => {
    //   this.venueGateway.handleVenueBookingDeleteMessage(booking);
    //   return booking;
    // })
    // .catch((err) => {
    //   return err;
    // });
  }
}
