import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { VenueModule } from './venue/venue.module';
import { S3Module } from './s3/s3.module';
import { EventModule } from './event/event.module';
import { ExtraModule } from './extra/extra.module';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
      isGlobal: true,
    }),
    AuthModule,
    UserModule,
    PrismaModule,
    VenueModule,
    S3Module,
    EventModule,
    ExtraModule,
    PaymentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
