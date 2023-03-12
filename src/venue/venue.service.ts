import {
  BadRequestException,
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateVenueDto } from './dto/create-venue.dto';
import { UpdateVenueDto } from './dto/update-venue.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ApiTags } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { FindVenueDto, QueryParamDto } from './dto/other.dto';
import { CreateVenueBookingDto } from './dto/createBooking.dto';
import { PrismaClient, Venue } from '@prisma/client';

@ApiTags('venue')
@Injectable()
export class VenueService {
  private prismaClient;
  constructor(private prisma: PrismaService, private config: ConfigService) {
    this.prismaClient = new PrismaClient();
  }

  async create(user: any, createVenueDto: CreateVenueDto) {
    const location = await this.findGeoLocation(createVenueDto);
    const types: [] = JSON.parse(createVenueDto.type);
    delete createVenueDto.type;
    try {
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
          images: ['hello'],
          coverImage: '',
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
      return venue;
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
          select: { review: true, User: { select: { name: true, id: true } } },
        },
        VenueType: { select: { Type: true } },
        User: true,
      },
    });
    const user = {
      name: venue.User.name,
      phone: JSON.parse('' + venue.User.phone),
      email: venue.User.email,
    };
    delete venue.User;
    return { venue, user };
  }

  remove(id: number) {
    return `This action removes a #${id} venue`;
  }

  async update(user: any, id: number, updateVenueDto: CreateVenueDto) {
    const location = await this.findGeoLocation(updateVenueDto);
    const types: [] = JSON.parse(updateVenueDto.type);
    delete updateVenueDto.type;
    if (!(await this.prisma.venue.findFirst({ where: { userId: user.id } })))
      return new UnauthorizedException('Sorry, you are not authorized!');
    try {
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
          images: ['hello'],
          coverImage: '',
          tables: +updateVenueDto.tables,
          toilets: +updateVenueDto.toilets,
          price: +updateVenueDto.price,
          chairs: +updateVenueDto.chairs,
          kitchens: +updateVenueDto.kitchens,
          latitude: location.lat,
          longitude: location.lng,
          people: +updateVenueDto.people,
        },
      });
      return venue;
    } catch (error) {
      return new BadRequestException(error);
    }
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
      throw new BadRequestException('End date should be after the start date!');

    if (existingBookings.length) {
      const bookingExist = existingBookings.find(
        (booking) =>
          body.startDate >= booking.startDate &&
          body.endDate <= booking.endDate,
      );
      if (bookingExist)
        throw new BadRequestException(
          `Sorry, there is alread a booking between ${bookingExist.startDate} till ${bookingExist.endDate}`,
        );
    }

    const venueBooking = await this.prisma.venueBookings.create({
      data: {
        userId: user.id,
        venueId: body.venueId,
        startDate: body.startDate,
        endDate: body.endDate,
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
    // this.venueGateway.handleSendMessage(venueBooking);
    return venueBooking;
  }
}
