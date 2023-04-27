import {
  IsEmail,
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { Prisma, Role, User } from '@prisma/client';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Exclude, Transform } from 'class-transformer';

export class CreateUserDto implements Prisma.UserCreateInput {
  @IsOptional()
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  name: string;

  @IsOptional()
  @IsEnum(Role)
  @ApiProperty()
  role: Role;

  @IsOptional()
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

export class GetUsersParams {
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @ApiProperty()
  limit: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @ApiProperty()
  page: string;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @ApiProperty()
  offset: string;

  @Transform(({ value }) => {
    const [field, type] = value[0].split(',');
    return { [field]: type.toLowerCase() };
  })
  @IsObject()
  @ApiProperty()
  sort: object;

  @IsOptional()
  @ApiProperty()
  queryParams: string;

  @IsOptional()
  @Transform(({ value }) => {
    const parsedValues = value
      .map((v) => v.split('||'))
      .reduce((acc, cur) => {
        return { ...acc, [cur[0].toLowerCase()]: cur[2] };
      }, {});

    return parsedValues;
  })
  filter: Array<object>;
}
