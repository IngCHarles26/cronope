import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";

@Injectable()
export class TimeService {
  constructor(private readonly prisma: PrismaService) {}

  async validateUser(token: string, competitionId: string) {
    const session = await this.prisma.session.findFirst({
      where: { token },
      select: { userId: true },
    });
    if (!session) return null;

    const counter = await this.prisma.counter.findUnique({
      where: {
        userId_competitionId: {
          userId: session.userId,
          competitionId,
        },
      },
      select: { order: true, alias: true, competition: { select: { counters: true } } },
    });
    if (!counter) return null;

    return {
      order: counter.order,
      total: counter.competition.counters.length,
      alias: counter.alias,
    };
  }

  async getUser(token: string) {
    const user = await this.prisma.session.findUnique({
      where: {
        token,
      },
    });
    return user;
  }
}
