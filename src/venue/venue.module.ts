import { Module } from '@nestjs/common';
import { VenueService } from './venue.service';
import { VenueController } from './venue.controller';
import { MulterModule } from '@nestjs/platform-express';
import { VenueReviewService } from './venue.review.service';
import { VenueReviewController } from './venue.review.controller';

@Module({
  imports: [MulterModule.register({ dest: './uploads' })],
  controllers: [VenueController, VenueReviewController],
  providers: [VenueService, VenueReviewService],
})
export class VenueModule {}
