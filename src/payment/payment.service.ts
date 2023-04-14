import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePaymentDto } from './createPayment.dto';
import Stripe from 'stripe';

@Injectable()
export class PaymentService {
  private stripe = new Stripe(
    'sk_test_51LjPI2LQopOFCRZk9ING2Mt8vxqxkU6KIIfOOEMmkZH29TmnueKyOyWScKnBmZa3DqiIM6DIFro2s3zHfxghK6pT00kOMM5Dvu',
    { apiVersion: '2022-11-15' },
  );

  constructor(private prisma: PrismaService) {}

  async createPayment(body: CreatePaymentDto) {
    let amount: number;
    if (body.type === 'event') {
      amount = (await this.prisma.event.findUnique({ where: { id: body.id } }))
        .price;
    } else {
      amount = (await this.prisma.venue.findUnique({ where: { id: body.id } }))
        .price;
    }
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: amount,
      currency: 'gbp',
    });

    return { client_secret: paymentIntent.client_secret };
  }
}
