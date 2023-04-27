import {
  IsEmail,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { Partner, Prisma } from '@prisma/brave';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreatePartnerDto implements Prisma.PartnerCreateInput {
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsString()
  @ApiProperty()
  name: string;

  @IsString()
  @ApiProperty()
  phone: string;

  @IsString()
  @ApiProperty()
  comment: string;

  @IsString()
  @ApiProperty()
  payment_terms: string;
}

export class UpdatePartnerDto extends PartialType(CreatePartnerDto) {}

export class ResponsePartnerDto implements Partner {
  @ApiProperty()
  id: number;
  @ApiProperty()
  email: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  phone: string;
  @ApiProperty()
  comment: string;
  @ApiProperty()
  payment_terms: string;
}

export class GetPartnersParams {
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @ApiProperty()
  limit: number;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @ApiProperty()
  page: string;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @ApiProperty()
  offset: string;

  @IsOptional()
  @Transform(({ value }) => {
    const [field, type] = value[0].split(',');
    return { [field]: type.toLowerCase() };
  })
  @IsObject()
  @ApiProperty()
  sort: object;

  @IsOptional()
  @IsOptional()
  @ApiProperty()
  queryParams: string;

  @IsOptional()
  @Transform(({ value }) => {
    const parsedValues = value
      .map((v) => v.split('||'))
      .reduce((acc, cur) => {
        if (cur[1] === '$in') {
          return {
            ...acc,
            [cur[0].toLowerCase()]: {
              in: cur[2].split(',').map((v) => Number(v)),
            },
          };
        }
        return { ...acc, [cur[0].toLowerCase()]: cur[2] };
      }, {});

    return parsedValues;
  })
  filter: Array<object>;
}
