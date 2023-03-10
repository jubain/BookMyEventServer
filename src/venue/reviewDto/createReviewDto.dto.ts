import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';

export class CreateReviewDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  venueId: number;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  review: string;
  @ApiProperty()
  @IsNumber()
  @Max(5)
  @Min(1)
  rating: number;
}
