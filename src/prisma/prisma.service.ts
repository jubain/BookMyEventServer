import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(config: ConfigService) {
    super({
      datasources: {
        db: {
          // url: config.get('TEST_DATABASE_URL'),
          url: 'mysql://root:Password@127.0.0.1:3307/BookMyEvent?schema=public',
        },
      },
    });
  }
}
