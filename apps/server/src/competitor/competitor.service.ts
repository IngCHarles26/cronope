import { Inject, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { generateId } from "better-auth";
import { apiResponse, checkAdmin, manageError } from "../lib";
import {
  DB_convertString,
  idCompetitorLength,
  convertDateToInputString,
  type CompetitorType,
  type Country,
  type TipoSangre,
  type Sex,
  type typeCompetitorSchemaPartial,
  type typeCompetitorSchema,
} from "@cronope/schemas";
import { REQUEST } from "@nestjs/core";

const nameService = "Competitor";

@Injectable()
export class CompetitorService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(REQUEST) private readonly request: Request & { session: any },
  ) {}

  private get session() {
    return this.request.session; // O como 'better-auth' guarde la sesión en el request
  }

  // ___________________________________________________________________ Create
  async create(body: typeCompetitorSchema) {
    try {
      checkAdmin(this.session);

      const { born, ...newCompetitior } = body;

      for (let key in newCompetitior) {
        const value = newCompetitior[key as keyof typeCompetitorSchema];
        if (value) newCompetitior[key] = DB_convertString(value);
      }
      const newCompetitor = await this.prisma.competitor.create({
        data: {
          ...newCompetitior,
          born: new Date(born),
          id: generateId(idCompetitorLength),
        },
      });

      const ans: CompetitorType = {
        ...newCompetitor,
        born: convertDateToInputString(newCompetitor.born),
        country: newCompetitor.country as Country,
        blood: newCompetitor.blood as TipoSangre | null,
        sex: newCompetitor.sex as Sex,
      };

      return apiResponse(true, "Competidor creado correctamente", ans);
    } catch (error) {
      manageError(error, nameService);
    }
  }

  // ___________________________________________________________________ FindAll
  async findAll() {
    try {
      checkAdmin(this.session);

      const data = await this.prisma.competitor.findMany({
        orderBy: { lastName: "asc" },
      });

      const ans: CompetitorType[] = data.map((el) => ({
        ...el,
        born: convertDateToInputString(el.born),
        country: el.country as Country,
        blood: el.blood as TipoSangre | null,
        sex: el.sex as Sex,
      }));

      return apiResponse(true, "Competidores obtenidos correctamente", ans);
    } catch (error) {
      manageError(error, nameService);
    }
  }

  // ___________________________________________________________________ Update
  async update(id: string, body: typeCompetitorSchemaPartial) {
    try {
      checkAdmin(this.session);

      const { born, blood, ...data } = body;
      for (let key in data) {
        const value = data[key as keyof typeCompetitorSchemaPartial];
        data[key] = typeof value === "string" ? DB_convertString(value) : value;
      }

      const updateCompetitor = await this.prisma.competitor.update({
        where: { id },
        data: { ...data, born: born ? new Date(born) : undefined },
      });

      const ans: CompetitorType = {
        ...updateCompetitor,
        born: convertDateToInputString(updateCompetitor.born),
        country: updateCompetitor.country as Country,
        blood: updateCompetitor.blood as TipoSangre | null,
        sex: updateCompetitor.sex as Sex,
      };

      return apiResponse(true, "Competidor actualizado correctamente", ans);
    } catch (error) {
      manageError(error, nameService);
    }
  }

  // ___________________________________________________________________ ToggleBan
  async toggleBan(id: string, reason: string) {
    try {
      checkAdmin(this.session);

      const competitor = await this.prisma.competitor.findUnique({
        where: { id },
        select: { banned: true, banReason: true },
      });

      if (!competitor) return apiResponse(false, "Competidor no encontrado");
      const oldStatus = competitor.banned;

      await this.prisma.competitor.update({
        where: { id },
        data: { banned: !oldStatus, banReason: reason },
      });

      const msg = oldStatus ? "habilitado" : "betado";

      return apiResponse(true, `Competidor ${msg} correctamente`);
    } catch (error) {
      manageError(error, nameService);
    }
  }
}
