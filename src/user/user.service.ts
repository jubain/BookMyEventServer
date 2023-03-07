import { Injectable } from '@nestjs/common';
import { EditDto } from './dtos/Edit.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  async editMe(user: any, body: EditDto) {
    const updatedUser = await this.prisma.user.update({
      where: { email: user.email },
      data: {
        ...body,
      },
    });
    delete updatedUser.password;
    return updatedUser;
  }

  async deleteMe(user: any) {
    await this.prisma.user.delete({
      where: { email: user.email },
    });
    return 'User Deleted!';
  }
}
