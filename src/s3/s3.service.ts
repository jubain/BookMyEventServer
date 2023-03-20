import { Injectable } from '@nestjs/common';
import { S3FileService } from './file.service';

@Injectable()
export class S3Service {
  constructor(private readonly fileService: S3FileService) {}
  async addImage(file: Buffer, fileName: string) {
    return this.fileService.uploadFile(file, fileName);
  }

  async deleteImg(key: string) {
    return this.fileService.deleteFile(key);
  }
}
