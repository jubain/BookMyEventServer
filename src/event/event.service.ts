import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { QueryParamDto } from './dto/others.dto';
import { Event } from '@prisma/client';
import { AddImageDto } from 'src/venue/dto/other.dto';
import { S3Service } from 'src/s3/s3.service';
import * as fs from 'fs';

@Injectable()
export class EventService {
  constructor(private prisma: PrismaService, private s3Service: S3Service) {}
  create(user: any, createEventDto: CreateEventDto) {
    const types: [] = JSON.parse(createEventDto.type);
    // return types;
    delete createEventDto.type;
    const event = this.prisma.event.create({
      data: {
        EventType: {
          createMany: {
            data: types.map((id) => {
              return { typeEventId: id };
            }),
          },
        },
        ...createEventDto,
        userId: user.id,
      },
    });
    return event;
  }

  async addEventImages(
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
    { venueId, type }: AddImageDto,
  ) {
    const event = await this.prisma.event.findFirst({
      where: { id: +venueId },
      include: { eventsImages: true },
    });

    if (type === 'coverImage') {
      const cImage = await this.s3Service.addImage(
        fs.readFileSync(coverImage.coverImage[0].path),
        coverImage.coverImage[0].filename,
      );
      await this.prisma.eventImages.create({
        data: {
          key: cImage.Key,
          type: type,
          url: cImage.Location,
          eventId: event.id,
        },
      });
      return 'Image added!';
    } else {
      images.images.forEach(async (img) => {
        if (event.eventsImages.length === 6) return;
        const upload = await this.s3Service.addImage(
          fs.readFileSync(img.path),
          img.filename,
        );
        await this.prisma.eventImages.create({
          data: {
            key: upload.Key,
            type: type,
            url: upload.Location,
            eventId: event.id,
          },
        });
        return event;
      });
    }
    return new BadRequestException('No more than 6 images!');
  }

  async findAll(filterDto: QueryParamDto) {
    let events = await this.prisma.event.findMany({
      include: {
        Venue: true,
        EventReview: true,
        EventType: { select: { TypeEvent: true } },
      },
    });
    if (filterDto.city) {
      events = events.filter((event) => event.Venue.city === filterDto.city);
    }

    delete filterDto.city;
    return this.filter(filterDto, events);
  }

  async findOne(id: number) {
    const event = await this.prisma.event.findFirst({
      where: { id: id },
      include: {
        eventsImages: true,
        EventReview: true,
        Venue: true,
        User: true,
      },
    });
    delete event.User.phone;
    return event;
  }

  async update(user: any, id: number, updateEventDto: UpdateEventDto) {
    const types: [] = JSON.parse(updateEventDto.type);
    const eventOrganiser = await this.prisma.event.findFirst({
      where: { id: id, userId: user.id },
    });

    if (!eventOrganiser)
      return new UnauthorizedException('Sorry, you are not authorized!');
    delete updateEventDto.type;
    await this.prisma.eventType.deleteMany({ where: { eventId: id } });
    const event = await this.prisma.event.update({
      where: { id: id },
      data: {
        ...updateEventDto,
        EventType: {
          createMany: {
            data: types.map((id) => {
              return { typeEventId: id };
            }),
          },
        },
      },
    });
    return event;
  }

  async remove(user: any, id: number) {
    const event = await this.prisma.event.findFirst({
      where: { id: id, userId: user.id },
      include: { eventsImages: true },
    });
    if (!event)
      return new UnauthorizedException('Sorry, you are not authorized!');
    event.eventsImages.forEach((image) => this.s3Service.deleteImg(image.key));
    await this.prisma.event.delete({ where: { id: id } });
    return 'Event Deleted!';
  }

  async removeImage(user: any, id: number) {
    const eventImage = await this.prisma.eventImages.findFirst({
      where: { id: id, Event: { userId: user.id } },
    });
    if (eventImage) {
      this.s3Service.deleteImg(eventImage.key);
      return 'Image Removed!';
    }
    return new UnauthorizedException('Unauthorized!');
  }

  filter(filterDto: QueryParamDto, events: Event[]) {
    const keys = Object.keys(filterDto);
    const filteredKey = keys.filter((key) => key !== 'price');
    const filteredVenue = events.filter((venue) => {
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
}
