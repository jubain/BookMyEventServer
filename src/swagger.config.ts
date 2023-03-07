import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Book My Event Server')
  .setDescription('This is a server made uisng node js, nest Js and TypeScript')
  .setVersion('1.0')
  .addTag('bme')
  .addBearerAuth()
  .build();
