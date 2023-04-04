import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';

@Injectable()
export class S3FileService {
  public async uploadFile(file: Buffer, fileName: string) {
    const s3 = new S3();
    const upload = await s3
      .upload({
        Bucket: 'bookmyevent',
        Body: file,
        Key: fileName,
      })
      .promise();
    return upload;
  }

  public async deleteFile(key: string) {
    const s3 = new S3();
    const deUpload = await s3
      .deleteObject({
        Bucket: 'bookmyevent',
        Key: key,
      })
      .promise();
    return deUpload;
  }
}
