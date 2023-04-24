import { Exclude } from 'class-transformer';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Prisma, Role, User } from '@prisma/client';
import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto implements Prisma.UserCreateInput {
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsString()
  @ApiProperty()
  name: string;

  @IsEnum(Role)
  @ApiProperty()
  role: Role;

  @IsString()
  @ApiProperty()
  password: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}

export class ResponseUserDto implements Omit<User, 'password'> {
  @ApiProperty()
  id: number;
  @ApiProperty()
  email: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  role: Role;
}
