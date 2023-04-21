import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../db/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUsers(): Promise<User[]> {
    return this.prisma.user.findMany({});
  }
}
