import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PartnerService } from './partner.service';
import { Partner } from '@prisma/brave';
import { Role } from '@prisma/client';
import {
  CreatePartnerDto,
  GetPartnersParams,
  ResponsePartnerDto,
  UpdatePartnerDto,
} from './dto/partner.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('partners')
@Controller('partners')
export class PartnerController {
  constructor(private userService: PartnerService) {}

  @Get()
  @Roles(Role.ADMIN, Role.USER)
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ type: ResponsePartnerDto, isArray: true })
  async getPartners(@Query() query: GetPartnersParams): Promise<any> {
    const findPartnerParams: any = {};
    console.log(88885, query);
    if (query.limit) findPartnerParams.take = query.limit;
    if (query.offset) findPartnerParams.skip = query.offset;
    if (query.sort) findPartnerParams.orderBy = query.sort;
    if (query.queryParams) {
      findPartnerParams.where = {
        OR: [
          { id: Number(query.queryParams) ? Number(query.queryParams) : {} },
          { email: { contains: query.queryParams } },
        ],
        ...query.filter,
      };
    }
    if (query.filter) {
      findPartnerParams.where = { ...findPartnerParams.where, ...query.filter };
    }

    const [data, total] = await this.userService.getPartners(findPartnerParams);

    return { data, total };
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.USER)
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ type: ResponsePartnerDto })
  async getPartnerById(@Param('id') id: number): Promise<Partner> {
    const user = await this.userService.getPartnerById(id);

    if (!user) throw new NotFoundException();

    return user;
  }

  @Post()
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ type: ResponsePartnerDto })
  async createPartner(
    @Body() createPartnerData: CreatePartnerDto,
  ): Promise<Partner> {
    return this.userService.createPartner(createPartnerData);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ type: ResponsePartnerDto })
  async updatePartner(
    @Param('id') id: number,
    @Body() updatePartnerData: UpdatePartnerDto,
  ): Promise<Partner> {
    return this.userService.updatePartner({ id }, updatePartnerData);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ type: ResponsePartnerDto })
  async deletePartner(@Param('id') id: number): Promise<Partner> {
    return this.userService.deletePartner(id);
  }
}
