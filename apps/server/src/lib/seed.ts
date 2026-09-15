import { generateId } from "better-auth";
import {
  DB_convertString,
  idCategoryLength,
  idCompetitorLength,
  idTeamLength,
} from "@cronope/schemas";
import { PrismaService } from "../prisma.service";
import { auth } from "./auth";
import {
  categoriesSeedData,
  competitorsSeedData,
  countersSeedData,
  teamsSeedData,
} from "./seed/index";

const COUNTERS_PASSWORD = "Prueba!123";

export const runSeed = async (prisma: PrismaService) => {
  await prisma.category.deleteMany();
  await prisma.category.createMany({
    skipDuplicates: true,
    data: categoriesSeedData.map((name) => ({
      id: generateId(idCategoryLength),
      name: DB_convertString(name),
    })),
  });

  await prisma.team.deleteMany();
  await prisma.team.createMany({
    skipDuplicates: true,
    data: teamsSeedData.map((name) => ({
      id: generateId(idTeamLength),
      name: DB_convertString(name),
    })),
  });
  await prisma.competitor.deleteMany();
  await prisma.competitor.createMany({
    skipDuplicates: true,
    data: competitorsSeedData.map(({ born, ...competitor }) => ({
      ...competitor,
      id: generateId(idCompetitorLength),
      born: new Date(born),
    })),
  });

  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  await auth.api.createUser({
    body: {
      email: DB_convertString("admin").replace(/ /g, ".") + process.env.EMAIL_DOMAIN,
      password: COUNTERS_PASSWORD,
      name: "admin",
      role: "admin",
    },
  });

  for (const { name } of countersSeedData) {
    const email = DB_convertString(name).replace(/ /g, "") + process.env.EMAIL_DOMAIN;

    await auth.api
      .createUser({
        body: {
          email,
          password: COUNTERS_PASSWORD,
          name,
          role: "counter",
        },
      })
      .catch((error: any) => console.warn(`Omitido usuario ${email}: ${error.message}`));
  }

  return {
    categories: categoriesSeedData.length,
    teams: teamsSeedData.length,
    competitors: competitorsSeedData.length,
    // counters: countersSeedData.length,
  };
};
