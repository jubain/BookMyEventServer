import { Injectable } from '@nestjs/common';
import { EditDto } from './dtos/Edit.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private authService: AuthService,
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
        events: true,
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
