import { Module } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "@thallesp/nestjs-better-auth";
import { auth } from "./lib/auth";
import { CompetitorModule } from "./competitor/competitor.module";
import { CompetitionModule } from "./competition/competition.module";
import { TimeModule } from "./time/time.module";
import { OthersModule } from "./others/others.module";
import { UsersModule } from "./users/users.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ".env" }),
    AuthModule.forRoot({ auth }),
    CompetitorModule,
    CompetitionModule,
    TimeModule,
    OthersModule,
    UsersModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}
