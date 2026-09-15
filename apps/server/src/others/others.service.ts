import { Inject, Injectable } from "@nestjs/common";
import {
  DB_convertString,
  idCategoryLength,
  idTeamLength,
  typeEditTeamSchema,
  typeNewCategoriesSchema,
  typeNewTeamsSchema,
} from "@cronope/schemas";
import { REQUEST } from "@nestjs/core";
import { PrismaService } from "../prisma.service";
import { apiResponse, checkAdmin, manageError, runSeed } from "../lib";
import { generateId } from "better-auth";

@Injectable()
export class OthersService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(REQUEST) private readonly request: Request & { session: any },
  ) {}

  private get session() {
    return this.request.session; // O como 'better-auth' guarde la sesión en el request
  }

  // ______________________________________________________________ Create categories
  async createCategories(body: typeNewCategoriesSchema) {
    try {
      checkAdmin(this.session);

      const data = body.list.map(({ name }) => ({
        name: DB_convertString(name),
        id: generateId(idCategoryLength),
      }));

      const categories = await this.prisma.category.createManyAndReturn({
        skipDuplicates: true,
        data,
      });

      return apiResponse(true, "Categoria creada correctamente", categories);
    } catch (error) {
      manageError(error, "category");
    }
  }

  // ______________________________________________________________ Get categories
  async findAllCategories() {
    try {
      checkAdmin(this.session);

      const categories = await this.prisma.category.findMany({
        orderBy: { name: "asc" },
      });

      return apiResponse(true, "Categorias obtenidas correctamente", categories);
    } catch (error) {
      manageError(error, "category");
    }
  }

  // ______________________________________________________________ Create teams
  async createTeams(body: typeNewTeamsSchema) {
    try {
      checkAdmin(this.session);

      const data = body.list.map(({ name }) => ({
        name: DB_convertString(name),
        id: generateId(idTeamLength),
      }));

      const teams = await this.prisma.team.createManyAndReturn({
        skipDuplicates: true,
        data,
      });

      return apiResponse(true, "Equipos creapdos correctamente", teams);
    } catch (error) {
      manageError(error, "team");
    }
  }

  // ______________________________________________________________ Get teams
  async findAllTeams() {
    try {
      checkAdmin(this.session);

      const teams = await this.prisma.team.findMany();

      return apiResponse(true, "Equipos obtenidos correctamente", teams);
    } catch (error) {
      manageError(error, "team");
    }
  }

  // ______________________________________________________________ Update Team
  async updateTeam(id: string, body: typeEditTeamSchema) {
    try {
      checkAdmin(this.session);

      const newData = await this.prisma.team.update({
        where: { id },
        data: { name: DB_convertString(body.name) },
      });

      return apiResponse(true, `Equipo ${newData.name} actualizado correctamente`, newData);
    } catch (error) {
      manageError(error, "team");
    }
  }

  async seed() {
    try {
      const counts = await runSeed(this.prisma);

      return apiResponse(true, "Seed ejecutado correctamente", counts);
    } catch (error) {
      manageError(error, "seed");
    }
  }
}
