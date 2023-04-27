import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from '../db/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUsers(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<[User[], number]> {
    const { skip, take, cursor, where, orderBy } = params;

    return this.prisma.$transaction([
      this.prisma.user.findMany({
        skip,
        take,
        cursor,
        where,
        orderBy,
      }),
      this.prisma.user.count(),
    ]);
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({ data });
  }

  async getUserById(id: number): Promise<User> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findUserByEmail(email: string): Promise<User> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async updateUser(
    where: Prisma.UserWhereUniqueInput,
    data: Prisma.UserUpdateInput,
  ): Promise<User> {
    return this.prisma.user.update({
      where,
      data,
    });
  }

  async deleteUser(id: number): Promise<User> {
    return this.prisma.user.delete({ where: { id } });
  }
}
