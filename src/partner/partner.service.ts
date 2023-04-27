import { Injectable } from '@nestjs/common';
import { Prisma, Partner } from '@prisma/brave';
import { PrismaBraveService } from '../db/prisma-brave.service';

@Injectable()
export class PartnerService {
  constructor(private prismaBrave: PrismaBraveService) {}

  async getPartners(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.PartnerWhereUniqueInput;
    where?: Prisma.PartnerWhereInput;
    orderBy?: Prisma.PartnerOrderByWithRelationInput;
  }): Promise<[Partner[], number]> {
    const { skip, take, cursor, where, orderBy } = params;

    return this.prismaBrave.$transaction([
      this.prismaBrave.partner.findMany({
        skip,
        take,
        cursor,
        where,
        orderBy,
      }),
      this.prismaBrave.partner.count(),
    ]);
  }

  async createPartner(data: Prisma.PartnerCreateInput): Promise<Partner> {
    return this.prismaBrave.partner.create({ data });
  }

  async getPartnerById(id: number): Promise<Partner> {
    return this.prismaBrave.partner.findUnique({ where: { id } });
  }

  async findPartnerByEmail(email: string): Promise<Partner> {
    return this.prismaBrave.partner.findFirst({ where: { email } });
  }

  async updatePartner(
    where: Prisma.PartnerWhereUniqueInput,
    data: Prisma.PartnerUpdateInput,
  ): Promise<Partner> {
    return this.prismaBrave.partner.update({
      where,
      data,
    });
  }

  async deletePartner(id: number): Promise<Partner> {
    return this.prismaBrave.partner.delete({ where: { id } });
  }
}
