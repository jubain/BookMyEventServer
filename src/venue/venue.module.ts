import { Module } from '@nestjs/common';
import { VenueService } from './venue.service';
import { VenueController } from './venue.controller';
import { VenueReviewService } from './venue.review.service';
import { VenueReviewController } from './venue.review.controller';
// import { VenueGateway } from './venue.gateway';
import { S3Module } from 'src/s3/s3.module';
import { S3Service } from 'src/s3/s3.service';
import { S3FileService } from 'src/s3/file.service';

@Module({
  imports: [S3Module],
  controllers: [VenueController, VenueReviewController],
  providers: [
    VenueService,
    VenueReviewService,
    // VenueGateway,
    S3Service,
    S3FileService,
  ],
})
export class VenueModule {}
