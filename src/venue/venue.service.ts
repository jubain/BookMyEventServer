import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateVenueDto } from './dto/create-venue.dto';
import { UpdateVenueDto } from './dto/update-venue.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ApiTags } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AddImageDto, FindVenueDto, QueryParamDto } from './dto/other.dto';
import { CreateVenueBookingDto } from './dto/createBooking.dto';
import { Venue } from '@prisma/client';
import { S3Service } from 'src/s3/s3.service';
import * as fs from 'fs';
import * as moment from 'moment';

@ApiTags('venue')
@Injectable()
export class VenueService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
    private s3Service: S3Service,
  ) {}

  async create(user: any, createVenueDto: CreateVenueDto) {
    const location = await this.findGeoLocation(createVenueDto);
    const types: [] = JSON.parse(createVenueDto.type);

    if (
      await this.prisma.venue.findFirst({
        where: { latitude: location.lat, longitude: location.lng },
      })
    )
      return new BadGatewayException('Location already in use!');
    delete createVenueDto.type;
    try {
      // const cImage = await this.s3Service.addImage(
      //   fs.readFileSync(coverImage.coverImage[0].path),
      //   coverImage.coverImage[0].filename,
      // );
      const venue = await this.prisma.venue.create({
        data: {
          VenueType: {
            createMany: {
              data: types.map((id) => {
                return { typeId: id };
              }),
            },
          },
          ...createVenueDto,
          userId: user.id,
          tables: +createVenueDto.tables,
          toilets: +createVenueDto.toilets,
          price: +createVenueDto.price,
          chairs: +createVenueDto.chairs,
          kitchens: +createVenueDto.kitchens,
          latitude: location.lat,
          longitude: location.lng,
          people: +createVenueDto.people,
        },
      });
      return { status: 200, data: venue };
      // await this.prisma.venueImages.create({
      //   data: {
      //     key: cImage.Key,
      //     type: 'coverImage',
      //     url: cImage.Location,
      //     venueId: venue.id,
      //   },
      // });
      // images.images.forEach(async (img) => {
      //   const upload = await this.s3Service.addImage(
      //     fs.readFileSync(img.path),
      //     img.filename,
      //   );
      //   await this.prisma.venueImages.create({
      //     data: {
      //       key: upload.Key,
      //       type: 'extraImages',
      //       url: upload.Location,
      //       venueId: venue.id,
      //     },
      //   });
      // });
    } catch (error) {
      return new BadRequestException(error);
    }
  }

  async findAll(user: any, filterDto: QueryParamDto) {
    const venues = await this.prisma.venue.findMany({
      where: { userId: user.id },
      include: { VenueType: true },
    });

    return this.filter(filterDto, venues);
  }

  async findAllPublic(filterDto: QueryParamDto, { coordinates }: FindVenueDto) {
    if (filterDto.city === 'Nearby') {
      filterDto.city = await this.findLocationByCord(coordinates);
    }
    const venues = await this.prisma.venue.findMany({
      where: {
        VenueType: { some: { Type: { name: filterDto.type } } },
      },
      include: { VenueType: { select: { Type: true } } },
    });

    delete filterDto.type;
    return this.filter(filterDto, venues);
  }

  async findOne(id: number) {
    const venue = await this.prisma.venue.findUnique({
      where: { id: id },
      include: {
        VenueBookings: true,
        VenueReview: {
          include: {
            User: { select: { name: true, id: true } },
          },
        },
        VenueType: { select: { Type: true } },
        User: true,
        VenueImages: true,
      },
    });
    const user = {
      name: venue.User.name,
      phone: JSON.parse('' + venue.User.phone),
      email: venue.User.email,
      image: venue.User.image,
      id: venue.User.id,
    };
    delete venue.User;
    return { venue, user };
  }

  async remove(id: number, user: any) {
    await this.prisma.venue.delete({ where: { id: id } });
    return 'Venue removed!';
  }

  async update(user: any, id: number, updateVenueDto: UpdateVenueDto) {
    let location;
    // if (updateVenueDto.type.length) {
    //   types = [...updateVenueDto.type];
    // }
    if (updateVenueDto.address1)
      location = await this.findGeoLocation(updateVenueDto);

    if (location) {
      if (location.response?.message === 'Address not found!')
        return new BadGatewayException('Address not found!');
      const venue = await this.prisma.venue.findUnique({ where: { id: id } });
      // if (venue.latitude !== location.lat && venue.longitude !== location.lng) {
      // }
      if (
        await this.prisma.venue.findFirst({
          where: { latitude: location.lat, longitude: location.lng },
          skip: id,
        })
      )
        return new BadGatewayException('Location already in use!');
    }

    if (!(await this.prisma.venue.findFirst({ where: { userId: user.id } })))
      return new UnauthorizedException('Sorry, you are not authorized!');
    try {
      const types: [] = JSON.parse(updateVenueDto.type);
      delete updateVenueDto.type;
      const venue = await this.prisma.venue.update({
        where: { id: id },
        data: {
          VenueType: {
            deleteMany: { venueId: id },
            createMany: {
              data: types.map((id) => {
                return { typeId: id };
              }),
            },
          },
          ...updateVenueDto,
          tables: +updateVenueDto.tables,
          toilets: +updateVenueDto.toilets,
          price: +updateVenueDto.price,
          chairs: +updateVenueDto.chairs,
          kitchens: +updateVenueDto.kitchens,
          latitude: location?.lat,
          longitude: location?.lng,
          people: +updateVenueDto.people,
        },
      });

      return venue;
    } catch (error) {
      return new BadRequestException(error);
    }
  }

  async deleteVenueImages(id: number) {
    const venue = await this.prisma.venueImages.findFirst({
      where: { id: id },
    });
    await this.prisma.venueImages.delete({
      where: { id: id },
    });
    await this.s3Service.deleteImg(venue.key);
    return 'Deleted!';
  }

  async addVenueImages(
    image: Express.Multer.File,
    { venueId, type }: AddImageDto,
  ) {
    const venue = await this.prisma.venue.findFirst({
      where: { id: +venueId },
      include: { VenueImages: true },
    });

    if (type === 'coverImage') {
      const cImage = await this.s3Service.addImage(
        fs.readFileSync(image.path),
        image.filename,
      );
      if (venue) {
        await this.prisma.venueImages.create({
          data: {
            key: cImage.Key,
            type: type,
            url: cImage.Location,
            venueId: venue.id,
          },
        });
        return 'Image added!';
      }
    }
    return new BadRequestException('No more than 6 images!');
  }

  filter(filterDto: QueryParamDto, venues: Venue[]) {
    const keys = Object.keys(filterDto);
    const filteredKey = keys.filter((key) => key !== 'price');
    const filteredVenue = venues.filter((venue) => {
      return filteredKey.every((key) => {
        if (typeof filterDto[key] === 'string') {
          return venue[key]
            .toLowerCase()
            .includes(filterDto[key].toLowerCase());
        }
      });
    });
    if (filterDto.price === 'ASCENDING') {
      return filteredVenue.sort((a, b) => a.price - b.price);
    } else if (filterDto.price === 'DESCENDING') {
      return filteredVenue.sort((a, b) => b.price - a.price);
    }
    return filteredVenue;
  }

  // Find Geolocation
  async findGeoLocation(body: CreateVenueDto | UpdateVenueDto) {
    const geoCoding = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${
        body.address1
      },${body.address2 && body.address2},${body.city},${body.postcode},${
        body.country
      }&key=${this.config.get('GOOGLE_API')}`,
    );

    if (geoCoding.ok) {
      const response = await geoCoding.json();
      if (!response.results.length)
        throw new BadRequestException('Address not found!');
      const { location } = response.results[0].geometry;
      return location;
    }
  }

  async findLocationByCord({ lat, lng }: { lat: number; lng: number }) {
    const location = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${this.config.get(
        'GOOGLE_API',
      )}`,
    );
    if (location.ok) {
      const response = await location.json();
      return response.results[
        response.results.length - 3
      ].formatted_address.split(',')[0];
    }
  }

  async createBooking(user: any, body: CreateVenueBookingDto) {
    const existingBookings = await this.prisma.venueBookings.findMany({
      where: {
        venueId: body.venueId,
      },
    });
    if (body.endDate < body.startDate)
      return new BadRequestException(
        'End date should be after the start date!',
      );

    if (existingBookings.length) {
      const bookingExist = existingBookings.find(
        (booking) =>
          (body.startDate >= booking.startDate &&
            body.endDate <= booking.endDate) ||
          body.startDate == booking.startDate,
      );
      if (bookingExist)
        return new BadRequestException(
          `Sorry, there is alread a booking between ${bookingExist.startDate} till ${bookingExist.endDate}`,
        );
    }

    // Total days to book for
    const diff = moment.duration(
      moment(body.endDate).diff(moment(body.startDate)),
    );
    const venue = await this.prisma.venue.findUnique({
      where: { id: body.venueId },
    });
    const venueBooking = await this.prisma.venueBookings.create({
      data: {
        userId: user.id,
        venueId: body.venueId,
        startDate: body.startDate,
        endDate: body.endDate,
        price: diff.days() * venue.price,
      },
      include: {
        Venue: {
          select: {
            name: true,
            User: { select: { id: true, name: true, email: true } },
          },
        },
      },
    });
    return venueBooking;
  }

  async cancelRequestBooking(id: number, user: any) {
    if (
      !(await this.prisma.venueBookings.findFirst({
        where: { id: id, userId: user.id },
      }))
    )
      return new UnauthorizedException('Sorry, you are not authorized!');

    return await this.prisma.venueBookings.update({
      where: { id: id },
      data: { requestCancel: true },
      include: { Venue: { select: { userId: true } } },
    });
  }

  async deleteBooking(id: number, user: any) {
    const booking = await this.prisma.venueBookings.findFirst({
      where: { id: id },
      include: { Venue: true },
    });
    if (booking.requestCancel) {
      if (booking.Venue.userId === user.id) {
        await this.prisma.venueBookings.delete({
          where: { id: id },
          include: { Venue: true },
        });
        return booking;
      }
    }
    return new UnauthorizedException('You are not the owner of the venue!');
  }

  async findImages() {
    return await this.prisma.venueImages.findMany();
  }
}
