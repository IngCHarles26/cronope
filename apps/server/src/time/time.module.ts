import { Module } from "@nestjs/common";
import { TimeService } from "./time.service";
import { TimeGateway } from "./time.gateway";
import { PrismaService } from "../prisma.service";

@Module({
  providers: [TimeGateway, TimeService, PrismaService],
})
export class TimeModule {}
