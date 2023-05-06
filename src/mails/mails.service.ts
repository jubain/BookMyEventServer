import { MailerService } from '@nestjs-modules/mailer';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class MailsService {
  constructor(private mailerService: MailerService) {}

  async sendUserVenueBookingConfirmation(user: any, bookingDetails: any) {
    try {
      console.log(user, bookingDetails);
      return await this.mailerService.sendMail({
        to: 'bepolen307@jobbrett.com',
        // from: 'jubeenamatya8@gmail.com',
        subject: `Booking confirmation for the venue`,
        template: './venueBookingConfirmation',
        context: {
          user,
          bookingDetails,
        },
      });
    } catch (error) {
      return new BadRequestException(error);
      console.error(error);
    }
  }
}
