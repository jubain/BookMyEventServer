import { MailerService } from '@nestjs-modules/mailer';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class MailsService {
  constructor(private mailerService: MailerService) {}

  async sendUserVenueBookingConfirmation(user: any, bookingDetails: any) {
    try {
      if (user) {
        const email = await this.mailerService.sendMail({
          to: user.email,
          from: 'jubeennp@outlook.com',
          subject: `Booking confirmation for the venue`,
          template: './venueBookingConfirmation',
          context: {
            name: 'James',
            bookingDetails: bookingDetails,
          },
        });
        return 'Email sent successfully';
      }
    } catch (error) {
      // return new BadRequestException(error);
      console.error(error);
    }
  }
}
