import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Min,
  MinLength,
} from 'class-validator';

export class EditDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty()
  @IsOptional()
  @Min(10)
  @IsNumber()
  phone?: number;

  @ApiProperty()
  @IsOptional()
  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'Passwords must contain at least one digit or one special character, one uppercase and one lowercase letter and must not contain any whitespace or newlines',
  })
  password?: string;
}
