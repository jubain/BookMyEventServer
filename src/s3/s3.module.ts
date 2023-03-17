import { Module } from '@nestjs/common';
import { S3Service } from './s3.service';
import { S3FileService } from './file.service';

@Module({
  providers: [S3Service, S3FileService],
})
export class S3Module {}
