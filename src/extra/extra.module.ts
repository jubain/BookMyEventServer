import { Module } from '@nestjs/common';
import { ExtraService } from './extra.service';
import { ExtraController } from './extra.controller';

@Module({
  controllers: [ExtraController],
  providers: [ExtraService],
})
export class ExtraModule {}
