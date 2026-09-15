import {
  Calendar,
  CompetitionLiveInfo,
  convertDateToInputString,
  DB_convertString,
  idCompetitionLength,
  parseLocalDate,
  ParticipantResult,
  SelectInputType,
  CompetitionType,
  typeCompetitionCounterSchema,
  typeCompetitionParticipantSchema,
  typeCompetitionSchema,
  typeCompetitionSchemaPartial,
  DetailCompetitionType,
  typeCompetitionCategoriesSchema,
  SaveParticipantResult,
  NoFinish,
  Countries,
  genCompetitorName,
} from "@cronope/schemas";
import { Inject, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { generateId } from "better-auth";
import { REQUEST } from "@nestjs/core";
import { apiResponse, checkAdmin, manageError } from "../lib";
import { Participant, Prisma } from "../generated/prisma/client";
import { CategoriesInCompetition } from "../generated/prisma/browser";

const nameService = "Competition";

@Injectable()
export class CompetitionService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(REQUEST) private readonly request: Request & { session: any },
  ) {}

  private get session() {
    return this.request.session; // O como 'better-auth' guarde la sesión en el request
  }

  // ___________________________________________________________________ Create Competition
  async create(body: typeCompetitionSchema) {
    try {
      checkAdmin(this.session);

      const newCompetition = await this.prisma.competition.create({
        data: {
          id: generateId(idCompetitionLength),
          name: DB_convertString(body.name),
          city: DB_convertString(body.city),
          startDate: parseLocalDate(body.startDate),
          endDate: parseLocalDate(body.endDate, false),
          startTime: +body.startTime,
          participantInterval: +body.participantInterval,
          categoryInterval: +body.categoryInterval,
        },
      });

      const ans: CompetitionType = {
        ...newCompetition,
        startDate: convertDateToInputString(newCompetition.startDate),
        endDate: convertDateToInputString(newCompetition.endDate),
        createdAt: convertDateToInputString(newCompetition.createdAt),
        startTime: newCompetition.startTime.toString(),
        participantInterval: newCompetition.participantInterval.toString(),
        categoryInterval: newCompetition.categoryInterval.toString(),
      };

      return apiResponse(true, "Competencia creada correctamente", ans);
    } catch (error) {
      manageError(error, nameService);
    }
  }

  // ___________________________________________________________________ Delete Competition
  async delete(competitionId: string) {
    try {
      checkAdmin(this.session);
      const limitDate = new Date(Date.now() - 1000 * 60 * 60 * 48); // 48 horas
      const competition = await this.prisma.competition.findFirst({
        where: { id: competitionId, createdAt: { gte: limitDate } },
      });
      if (!competition) return apiResponse(false, "No puedes eliminar esta competencia");

      await this.prisma.competition.delete({
        where: { id: competitionId },
      });

      return apiResponse(true, "Competicion eliminada correctamente");
    } catch (error) {
      manageError(error, nameService);
    }
  }

  // ___________________________________________________________________ Toggle Competition
  async toggle(competitionId: string) {
    try {
      checkAdmin(this.session);

      const nowDate = new Date();
      const competition = await this.prisma.competition.findFirst({
        where: {
          id: competitionId,
          startDate: { lt: nowDate },
          NOT: { status: false, endDate: { lt: nowDate } }, // NOT = excepto
        },
        select: { status: true },
      });
      if (!competition) return apiResponse(false, "No puedes editar esta competencia");

      const newStatus = !competition.status;

      await this.prisma.competition.update({
        where: { id: competitionId },
        data: { status: newStatus },
      });

      const message = `Competicion ${newStatus ? "activada" : "desactivada"} correctamente`;
      return apiResponse(true, message);
    } catch (error) {
      manageError(error, nameService);
    }
  }

  // ___________________________________________________________________ Get All Competition
  async findAll() {
    try {
      checkAdmin(this.session);

      const _competitions = await this.prisma.competition.findMany({
        orderBy: { startDate: "asc" },
        include: { counters: { select: { userId: true, alias: true } } },
      });

      const competitions: CompetitionType[] = [];
      const counterCalendar: Calendar = {};

      for (const { counters, ...competition } of _competitions) {
        competitions.push({
          ...competition,
          participantInterval: competition.participantInterval.toString(),
          categoryInterval: competition.categoryInterval.toString(),
          startTime: competition.startTime.toString(),
          startDate: convertDateToInputString(competition.startDate),
          endDate: convertDateToInputString(competition.endDate),
          createdAt: convertDateToInputString(competition.createdAt),
        });

        const name = competition.name;
        const start = competition.startDate;
        const end = competition.endDate;

        for (const { userId, alias } of counters) {
          if (!counterCalendar[userId]) counterCalendar[userId] = [];
          counterCalendar[userId].push({
            name: alias,
            competition: name,
            start: new Date(start).getTime(),
            end: new Date(end).getTime(),
          });
        }
      }

      return apiResponse(true, "Competiciones obtenidas correctamente", {
        competitions,
        counterCalendar,
      });
    } catch (error) {
      manageError(error, nameService);
    }
  }

  // ___________________________________________________________________ Update Competition
  async update(competitionId: string, body: typeCompetitionSchemaPartial) {
    const compareDate = (date: string | undefined, old: Date, start = true) => {
      if (!date) return undefined;
      const newDate = parseLocalDate(date, start);
      if (newDate.getTime() !== old.getTime()) return newDate;
    };

    const compareNumber = (num: string | undefined, old: number) => {
      if (!num) return undefined;
      const newNum = +num;
      if (old !== newNum) return newNum;
    };

    let message = "";
    try {
      checkAdmin(this.session);
      const nowDate = new Date();
      const competition = await this.prisma.competition.findFirst({
        where: { id: competitionId, status: false, startDate: { gt: nowDate } },
        include: { counters: { select: { userId: true } } },
      });

      if (!competition) return apiResponse(false, "No puedes editar esta competencia");

      const { city, startDate, endDate, name, participantInterval, categoryInterval, startTime } =
        body;

      const data = {
        name: name && name !== competition.name ? DB_convertString(name) : undefined,
        city: city && city !== competition.city ? DB_convertString(city) : undefined,
        startDate: compareDate(startDate, competition.startDate),
        endDate: compareDate(endDate, competition.endDate, false),
        participantInterval: compareNumber(participantInterval, competition.participantInterval),
        categoryInterval: compareNumber(categoryInterval, competition.categoryInterval),
        startTime: compareNumber(startTime, competition.startTime),
      };

      const counters = competition.counters.map(({ userId }) => userId);

      const { startDate: newStartDate, endDate: newEndDate } = data;
      if (newStartDate) {
        if (newStartDate < nowDate)
          return apiResponse(false, "No se puede actualizar la fecha de inicio a una pasada");

        const isStartOverlap = await this.prisma.competition.findFirst({
          where: {
            NOT: { id: competitionId },
            counters: { some: { userId: { in: counters } } },
            startDate: { lte: newStartDate },
            endDate: { gte: newStartDate },
          },
        });
        message = "La nueva fecha de inicio solapa un contador con otra competicion";
        if (isStartOverlap) return apiResponse(false, message);
      }

      if (newEndDate) {
        if (newEndDate < nowDate)
          return apiResponse(false, "No se puede actualizar la fecha de fin a una pasada");
        const isEndOverlap = await this.prisma.competition.findFirst({
          where: {
            NOT: { id: competitionId },
            counters: { some: { userId: { in: counters } } },
            startDate: { lte: newEndDate },
            endDate: { gte: newEndDate },
          },
        });
        message = "La nueva fecha de fin solapa un contador con otra competicion";
        if (isEndOverlap) return apiResponse(false, message);
      }

      if (startDate && endDate && startDate > endDate)
        return apiResponse(false, "La fecha de inicio no puede ser posterior a la fecha de fin");

      if (Object.values(data).every((value) => value === undefined))
        return apiResponse(true, "No se detectaron cambios");

      await this.prisma.competition.update({
        where: { id: competitionId },
        data,
      });

      return apiResponse(true, "Competicion actualizada correctamente");
    } catch (error) {
      manageError(error, nameService);
    }
  }

  // ___________________________________________________________________ Update Categories
  async updateCategories(
    competitionId: string,
    { list: newCategories }: typeCompetitionCategoriesSchema,
  ) {
    let message = "";

    try {
      checkAdmin(this.session);

      const nowDate = new Date();
      const competition = await this.prisma.competition.findFirst({
        where: { id: competitionId, status: false, startDate: { gt: nowDate } },
        select: { startDate: true, endDate: true, status: true, categories: true },
      });
      if (!competition) return apiResponse(false, "La competicion no existe");

      const { startDate, endDate, categories: oldCategories } = competition;

      const duration = Math.ceil((endDate.getTime() - startDate.getTime()) / 86400000);
      const existExtraDay = newCategories.some(({ day }) => +day > duration);
      message = "No se pueden agregar categorias con dias que excedan la duracion";
      if (existExtraDay) return apiResponse(false, message);

      const updates: Prisma.PrismaPromise<any>[] = [];
      const newList: Omit<CategoriesInCompetition, "id">[] = [];
      for (const { categoryId, day, description, order } of newCategories) {
        const ix = oldCategories.findIndex((c) => c.categoryId === categoryId);
        if (ix > -1) {
          const oldCategory = oldCategories[ix];
          const oldDescription = oldCategory.description;
          const newDescription = DB_convertString(description);

          const data = {
            day: oldCategory.day.toString() !== day ? +day : undefined,
            description: oldDescription !== newDescription ? newDescription : undefined,
            order: oldCategory.order.toString() !== order ? +order : undefined,
          };
          oldCategories.splice(ix, 1);
          if (Object.values(data).every((value) => value === undefined)) continue;

          updates.push(
            this.prisma.categoriesInCompetition.update({
              where: { id: oldCategory.id },
              data,
            }),
          );
        } else {
          newList.push({ competitionId, categoryId, day: +day, description, order: +order });
        }
      }

      if (oldCategories.length > 0) {
        const existParticipant = await this.prisma.participant.findFirst({
          where: {
            categoryId: { in: oldCategories.map((c) => c.id) },
          },
        });
        if (existParticipant)
          return apiResponse(false, "No se pueden eliminar categorias con participantes inscritos");

        updates.push(
          this.prisma.categoriesInCompetition.deleteMany({
            where: {
              id: { in: oldCategories.map((c) => c.id) },
            },
          }),
        );
      }

      if (newList.length > 0) {
        updates.push(
          this.prisma.categoriesInCompetition.createMany({
            data: newList,
          }),
        );
      }

      await this.prisma.$transaction(updates);

      return apiResponse(true, "Categorias actualizadas correctamente");
    } catch (error) {
      manageError(error, nameService);
    }
  }

  // ___________________________________________________________________ Update Counters
  async updateCounters(competitionId: string, { list }: typeCompetitionCounterSchema) {
    let message = "No se puede actualizar los contadores";
    try {
      checkAdmin(this.session);
      const nowDate = new Date();
      const competition = await this.prisma.competition.findFirst({
        where: { id: competitionId, status: false, startDate: { gt: nowDate } },
        select: { startDate: true, endDate: true, status: true },
      });
      if (!competition) return apiResponse(false, "No puedes actualizar la competencia");

      const counters = list.map(({ userId }) => userId);
      const isStartOverlap = await this.prisma.competition.findFirst({
        where: {
          NOT: { id: competitionId },
          counters: { some: { userId: { in: counters } } },
          startDate: { lte: competition.startDate },
          endDate: { gte: competition.startDate },
        },
      });
      message = "La nueva lista de contadores solapa con otra competicion";
      if (isStartOverlap) return apiResponse(false, message);

      await this.prisma.counter.deleteMany({ where: { competitionId } });
      await this.prisma.counter.createMany({
        data: list.map((counter, ix) => ({
          competitionId,
          userId: counter.userId,
          alias: DB_convertString(counter.alias),
          order: ix + 1,
        })),
      });

      return apiResponse(true, "Contadores actualizados correctamente");
    } catch (error) {
      manageError(error, nameService);
    }
  }

  // ___________________________________________________________________ Update Participants
  async updateParticipants(
    competitionId: string,
    { list: newParticipants }: typeCompetitionParticipantSchema,
  ) {
    const compareNumber = (num: string | undefined | null, old: number | undefined | null) => {
      if (!num) return undefined;
      const newNum = +num;
      if (!old || old !== newNum) return newNum;
    };

    try {
      checkAdmin(this.session);

      const nowDate = new Date();
      const competition = await this.prisma.competition.findUnique({
        where: { id: competitionId, status: false, startDate: { gte: nowDate } },
        select: { participants: true },
      });
      if (!competition) return apiResponse(false, "No puedes actualizar esta competencia");

      const oldParticipants = competition.participants;
      const updates: Prisma.PrismaPromise<any>[] = [];
      const newList: Omit<Participant, "id" | "times" | "noFinish" | "noFinishReason">[] = [];

      for (const { competitorId, teamId, categoryId, order, dorsal } of newParticipants) {
        const ix = oldParticipants.findIndex((p) => p.competitorId === competitorId);
        if (ix !== -1) {
          const { id, ...participant } = oldParticipants[ix];
          oldParticipants.splice(ix, 1);

          const data = {
            categoryId: compareNumber(categoryId, participant.categoryId),
            order: compareNumber(order, participant.order),
            dorsal: compareNumber(dorsal, participant.dorsal),
            teamId: participant.teamId !== teamId ? teamId || null : undefined,
          };

          if (Object.values(data).every((el) => el === undefined)) continue;

          updates.push(
            this.prisma.participant.update({
              where: { id },
              data,
            }),
          );
        } else {
          newList.push({
            competitionId,
            categoryId: +categoryId,
            competitorId,
            teamId: teamId || null,
            order: order ? +order : null,
            dorsal: dorsal ? +dorsal : null,
          });
        }
      }
      if (oldParticipants.length > 0) {
        updates.push(
          this.prisma.participant.deleteMany({
            where: {
              id: { in: oldParticipants.map((p) => p.id) },
            },
          }),
        );
      }

      if (newList.length > 0) {
        updates.push(
          this.prisma.participant.createMany({
            data: newList,
          }),
        );
      }

      await this.prisma.$transaction(updates);

      return apiResponse(true, "Participantes actualizados correctamente");
    } catch (error) {
      manageError(error, nameService);
    }
  }

  // ___________________________________________________________________ FindCompetition
  async findOne(id: string) {
    try {
      checkAdmin(this.session);

      const competition = await this.prisma.competition.findUnique({
        where: { id },

        select: {
          id: true,
          counters: {
            orderBy: { order: "asc" },
            include: { user: { select: { name: true } } },
          },
          participants: {
            orderBy: [
              { category: { day: "asc" } },
              { category: { order: "asc" } },
              { order: "asc" },
            ],
          },
          categories: {
            orderBy: [{ day: "asc" }, { order: "asc" }],
            include: { category: { select: { name: true } } },
          },
        },
      });

      if (!competition) return apiResponse(false, "La competicion no existe");

      const counters = competition.counters.map((counter) => ({
        id: counter.id,
        name: counter.user.name,
        userId: counter.userId,
        competitionId: counter.competitionId,
        alias: counter.alias,
        order: counter.order,
      }));

      const categories = competition.categories.map((category) => ({
        id: category.id,
        competitionId: category.competitionId,
        categoryId: category.categoryId,
        day: category.day.toString(),
        order: category.order.toString(),
        description: category.description,
        name: category.category.name,
      }));

      const participants = competition.participants.map(({ order, dorsal, ...participant }) => ({
        id: participant.id,
        competitionId: participant.competitionId,
        competitorId: participant.competitorId,
        categoryId: participant.categoryId.toString(),
        teamId: participant.teamId || "",
        order: order ? order.toString() : "",
        dorsal: dorsal ? dorsal.toString() : "",
        times: participant.times,
      }));

      const ans: DetailCompetitionType = { id: competition.id, counters, categories, participants };

      return apiResponse(true, "Competicion encontrada", ans);
    } catch (error) {
      manageError(error, nameService);
    }
  }

  // ___________________________________________________________________ GetResults
  async getResults(competitionId: string) {
    try {
      checkAdmin(this.session);

      const participants = await this.prisma.participant.findMany({
        where: { competitionId },
        include: {
          competitor: {
            select: {
              name: true,
              lastName: true,
              country: true,
              carnet: true,
            },
          },
          category: {
            select: {
              category: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      });

      const ans: ParticipantResult[] = participants.map(
        ({ competitor: { country, name, lastName, carnet }, ...el }) => ({
          name: genCompetitorName(country, name, lastName, carnet),
          category: el.category.category.name,
          team: el.teamId || null,
          order: el.order,
          dorsal: el.dorsal,
          times: el.times.map(Number),
          noFinish: el.noFinish as NoFinish | null,
        }),
      );

      return apiResponse(true, "Resultados obtenidos", ans);
    } catch (error) {
      manageError(error, nameService);
    }
  }
  // ___________________________________________________________________ GetTodayCompetition
  /**
   * validar competencia, activo y asignado al usuario actual
   * Validar si el es el coontador del inicio
   * si es el asignado retorna la lsita de competidores
   * lista de competidores
   */
  async getTodayCompetition() {
    try {
      const now = new Date("9-13-2026");
      const userId = this.session.user.id;

      const counter = await this.prisma.counter.findFirst({
        where: {
          userId,
          competition: {
            status: true,
            startDate: { lte: now },
            endDate: { gte: now },
          },
        },
        include: {
          competition: {
            include: {
              participants: {
                where: {
                  noFinish: null,
                },
                orderBy: [{ order: "asc" }],
                include: {
                  competitor: true,
                  category: {
                    select: {
                      id: true,
                      day: true,
                      category: { select: { name: true } },
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!counter) return apiResponse(false, "No tienes competiciones asignadas para hoy");
      const competition = counter.competition;
      const nowday = now.getDay();
      const startDay = competition.startDate.getDay();
      const currentDay = (8 + nowday - startDay) % 7;

      const categories: SelectInputType[] = [];
      const participants: Record<string, SelectInputType[]> = {};

      for (const {
        id: participantId,
        dorsal,
        times,
        category: { category, id, day },
        competitor: { name, lastName, carnet },
      } of competition.participants) {
        if (day !== currentDay || times.length > 0) continue;

        const uci = carnet ? `(${carnet})` : "";
        const competitorLabel = `#${dorsal} ${lastName}, ${name} ${uci}`;
        const categoryId = id.toString();

        if (!categories.some((category) => category.value === categoryId))
          categories.push({ value: categoryId, label: category.name });

        if (!participants[categoryId]) participants[categoryId] = [];
        participants[categoryId].push({ value: participantId.toString(), label: competitorLabel });
      }

      const ans: CompetitionLiveInfo = {
        competitionId: competition.id,
        competitionName: competition.name,

        counterId: counter.id,
        counterAlias: counter.alias,
        counterOrder: counter.order,
        categories,
        participants,
      };

      return apiResponse(true, "Competicion encontrada", ans);
    } catch (error) {
      manageError(error, nameService);
    }
  }

  // ___________________________________________________________________ Add ParticipantTime

  async addParticipantTime(
    participantId: number,
    { times, noFinish, noFinishReason }: SaveParticipantResult,
  ) {
    try {
      const userId = this.session.user.id;

      const participant = await this.prisma.participant.findUnique({
        where: { id: participantId },
        select: { competition: { select: { counters: true } } },
      });

      if (!participant) return apiResponse(false, "Participante no encontrado");
      const counters = participant.competition.counters;
      const counter = counters.find((counter) => counter.userId === userId);
      if (!counter || counter.order !== 1)
        return apiResponse(false, "No puedes guardar datos de tiempo");

      let timesFinal: string[] = [];
      if (noFinish && noFinishReason) {
        timesFinal = Array(counters.length).fill("1");
      } else {
        const timesS = times[0];
        const timesF = times.at(-1);
        const validFormat =
          times.length === counters.length && timesS && timesF && +timesF > +timesS;
        if (!validFormat) return apiResponse(false, "El formato de los tiempos es invalido");
        timesFinal = times.map((el) => (el ? `${el}` : "1"));
      }

      await this.prisma.participant.update({
        where: { id: participantId },
        data: { times: timesFinal, noFinish, noFinishReason },
      });

      return apiResponse(true, "Tiempos guardados correctamente");
    } catch (error) {
      manageError(error, nameService);
    }
  }
}
