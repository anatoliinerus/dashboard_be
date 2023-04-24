import { IsEmail, IsEnum, IsString } from 'class-validator';
import { Prisma, Role, User } from '@prisma/client';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

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
  @Exclude()
  password: string;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
