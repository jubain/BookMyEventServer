import { BadGatewayException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}
  async create(user: any, user2Id: number) {
    const userInUser1 = await this.prisma.room.findFirst({
      where: { user1: user.id, user2: user2Id },
      include: { Message: true },
    });
    const userInUser2 = await this.prisma.room.findFirst({
      where: { user2: user.id, user1: user2Id },
      include: { Message: true },
    });
    if (!userInUser1 && !userInUser2) {
      const room = await this.prisma.room.create({
        data: { user1: user.id, user2: user2Id },
        include: { Message: true },
      });
      return room;
    }
    if (userInUser1) {
      return userInUser1;
    } else {
      return userInUser2;
    }
  }

  async findAll(user: any) {
    const chats = await this.prisma.room.findMany({
      where: { OR: [{ user1: user.id }, { user2: user.id }] },
      include: {
        Message: true,
      },
    });
    return chats;
  }

  async findOne(id: number) {
    return await this.prisma.room.findUnique({
      where: { id: id },
      include: { Message: true },
    });
  }

  async update(user: any, id: number, message: string) {
    try {
      const result = await this.prisma.room.update({
        where: { id: id },
        data: {
          Message: {
            create: {
              senderId: user.sub,
              message: message,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          },
        },
        include: { Message: true },
      });
      return result;
    } catch (error) {
      console.log(error);
      throw new BadGatewayException('Unable to sent the message!');
    }
  }

  remove(id: number) {
    return `This action removes a #${id} chat`;
  }

  // async findOneChat(user: any, body: CreateRoomDto) {
  //   const chatExist = await this.prisma.room.findFirst({
  //     where: {}
  //   });
  // }
}
