import {
  BadGatewayException,
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { EditDto } from './dtos/Edit.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthService } from 'src/auth/auth.service';
import { S3Service } from 'src/s3/s3.service';
import * as fs from 'fs';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private authService: AuthService,
    private s3Service: S3Service,
  ) {}
  async getMe(user: any) {
    const token = await this.authService.signToken(
      user.id,
      user.email,
      'login',
    );
    const me = await this.prisma.user.findUnique({
      where: { email: user.email },
      include: {
        events: {
          include: {
            eventsImages: true,
            EventType: { select: { eventId: true } },
          },
        },
        venues: {
          include: {
            VenueImages: true,
            VenueType: { select: { typeId: true } },
          },
        },
        VenueBookings: { include: { Venue: true } },
        EventBooking: { include: { Event: { include: { Venue: true } } } },
        SavedVenue: true,
        SavedEvent: true,
      },
    });
    delete me.password;
    const phoneString = me.phone;
    delete me.phone;
    return { ...me, phone: '' + phoneString, token };
  }
  async editMe(user: any, body: EditDto) {
    const updatedUser = await this.prisma.user.update({
      where: { email: user.email },
      data: body.password
        ? {
            ...body,
          }
        : {
            name: body.name,
            phone: body.phone,
          },
    });
    delete updatedUser.password;
    delete updatedUser.phone;
    return updatedUser;
  }

  async deleteMe(user: any) {
    await this.prisma.user.delete({
      where: { email: user.email },
    });
    return 'User Deleted!';
  }

  async getBookings(user: any) {
    return await this.prisma.user.findUnique({
      where: { id: user.id },
      select: {
        VenueBookings: { include: { Venue: true } },
        EventBooking: { include: { Event: true } },
      },
    });
  }

  async getHostings(user: any) {
    return await this.prisma.user.findUnique({
      where: { id: user.id },
      select: {
        venues: true,
        events: { include: { Venue: true } },
      },
    });
  }

  async addUserImages(user: any, image: Express.Multer.File) {
    try {
      const userFound = await this.prisma.user.findUnique({
        where: { id: user.id },
      });
      if (userFound.imageKey) {
        await this.s3Service.deleteImg(userFound.imageKey);
        await this.prisma.user.update({
          where: { id: user.id },
          data: { image: null, imageKey: null },
        });
      }
      const cImage = await this.s3Service.addImage(
        fs.readFileSync(image.path),
        image.filename,
      );
      await this.prisma.user.update({
        where: { id: user.id },
        data: { image: cImage.Location, imageKey: cImage.Key },
      });
      return 'Image uploaded';
    } catch (error) {
      return new BadRequestException(error);
    }
  }
}
