import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { S3Service } from 'src/s3/s3.service';
import { S3FileService } from 'src/s3/file.service';
import { S3Module } from 'src/s3/s3.module';

@Module({
  controllers: [EventController],
  providers: [EventService, S3Service, S3FileService],
  imports: [S3Module],
})
export class EventModule {}
