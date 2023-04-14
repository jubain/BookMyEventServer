import { Injectable } from '@nestjs/common';
import { CreateExtraDto } from './dto/create-extra.dto';
import { UpdateExtraDto } from './dto/update-extra.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ExtraService {
  constructor(private prisma: PrismaService) {}
  create(createExtraDto: CreateExtraDto) {
    return 'This action adds a new extra';
  }

  async findAllVenueTypes() {
    return await this.prisma.type.findMany();
  }
  findAllEventTypes() {
    return `This action returns all extra`;
  }

  findOne(id: number) {
    return `This action returns a #${id} extra`;
  }

  update(id: number, updateExtraDto: UpdateExtraDto) {
    return `This action updates a #${id} extra`;
  }

  remove(id: number) {
    return `This action removes a #${id} extra`;
  }
}
