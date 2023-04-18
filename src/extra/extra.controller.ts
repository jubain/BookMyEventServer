import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ExtraService } from './extra.service';
import { CreateExtraDto } from './dto/create-extra.dto';
import { UpdateExtraDto } from './dto/update-extra.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@Controller('')
@ApiTags('extras')
export class ExtraController {
  constructor(private readonly extraService: ExtraService) {}

  @Post()
  create(@Body() createExtraDto: CreateExtraDto) {
    return this.extraService.create(createExtraDto);
  }

  @Get('/venueTypes')
  // @ApiBearerAuth()
  // @UseGuards(AuthGuard('jwt'))
  findAllVenueTypes() {
    return this.extraService.findAllVenueTypes();
  }

  @Get('/eventTypes')
  findAllEventTypes() {
    return this.extraService.findAllEventTypes();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.extraService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateExtraDto: UpdateExtraDto) {
    return this.extraService.update(+id, updateExtraDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.extraService.remove(+id);
  }
}
