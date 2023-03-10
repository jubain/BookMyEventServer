import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateReviewDto } from './reviewDto/createReviewDto.dto';

@Injectable()
export class VenueReviewService {
  constructor(private prisma: PrismaService) {}
  async findAll(venueId: number) {
    return this.prisma.venueReview.findMany({ where: { venueId: venueId } });
  }

  async create(user: any, body: CreateReviewDto) {
    try {
      const venue = await this.prisma.venue.findUnique({
        where: { id: body.venueId },
        include: { User: true },
      });
      if (!venue) {
        return new NotFoundException('Venue not found!');
      }

      await this.prisma.venueReview.create({
        data: {
          ...body,
          userId: user.id,
        },
      });
      return `${venue.User.name} thanks you for your review!`;
    } catch (error) {
      throw new HttpException(error, error);
    }
  }
}
