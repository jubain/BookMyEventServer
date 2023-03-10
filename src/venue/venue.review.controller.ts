import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { VenueReviewService } from './venue.review.service';
import { CreateReviewDto } from './reviewDto/createReviewDto.dto';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';

@Controller('venue/reviews')
@ApiTags('venue/reviews')
export class VenueReviewController {
  constructor(private service: VenueReviewService) {}
  @Get()
  findAll(@Body() id: string) {
    return this.service.findAll(+id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Req() req: Request, @Body() body: CreateReviewDto) {
    return this.service.create(req.user, body);
  }
}
