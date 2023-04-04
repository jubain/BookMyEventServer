import { Injectable } from '@nestjs/common';
import { EditDto } from './dtos/Edit.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  async getMe(user: any) {
    await this.prisma.user.findUnique({
      where: { email: user.email },
      include: {
        events: true,
        venues: true,
        VenueBookings: true,
        EventBooking: true,
        SavedVenue: true,
        SavedEvent: true,
      },
    });
    return {
      email: user.email,
      name: user.name,
      phone: `${user.phone}`,
      createdAt: user.createdAt,
    };
  }
  async editMe(user: any, body: EditDto) {
    const updatedUser = await this.prisma.user.update({
      where: { email: user.email },
      data: {
        ...body,
      },
    });
    delete updatedUser.password;
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
}
