import { Module } from '@nestjs/common';
import { MailsService } from './mails.service';
import { MailsController } from './mails.controller';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';

@Module({
  controllers: [MailsController],
  providers: [MailsService],
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.office365.com',
        secure: false,
        port: 587,
        auth: {
          user: 'jubeennp@outlook.com',
          pass: 'Jubeen123!@#',
        },
      },

      preview: true,
      template: {
        dir: join(__dirname, 'templates'),
        adapter: new EjsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  exports: [MailsService],
})
export class MailsModule {}
