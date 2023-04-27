import { User } from '@prisma/client';
import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// import { INVALID_EMAIL } from '../../shared/constants/strings';
const INVALID_EMAIL = 'Missing or invalid email!';

export class AuthResponseDto {
  user: User;
  accessToken: string;
}

export class RegisterUserDto {
  @IsString()
  @ApiProperty()
  email: string;

  @IsString()
  @ApiProperty()
  name: string;

  @IsString()
  @ApiProperty()
  password: string;

  @IsNumber()
  @ApiProperty()
  partnerId: number;
}

export class LoginUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  @IsEmail({}, { message: INVALID_EMAIL })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  password: string;
}
