import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { PrismaBraveService } from './prisma-brave.service';

@Module({
  providers: [PrismaService, PrismaBraveService],
  exports: [PrismaService, PrismaBraveService],
})
export class DbModule {}
