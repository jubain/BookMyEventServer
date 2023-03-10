import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  Min,
  MinLength,
} from 'class-validator';

enum Role {
  CUSTOMER = 'CUSTOMER',
  OWNER = 'OWNER',
}

export class RegisterDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ default: 'string@email.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'Passwords must contain at least one digit or one special character, one uppercase and one lowercase letter and must not contain any whitespace or newlines',
  })
  password: string;

  @ApiProperty({ default: Role.CUSTOMER, type: Role, enum: Role })
  @IsNotEmpty()
  role: Role;

  @ApiProperty()
  @IsNotEmpty()
  @Min(10)
  phone: number;
}
