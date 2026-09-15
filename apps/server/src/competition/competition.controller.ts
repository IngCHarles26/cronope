import {
  type typeCompetitionCounterSchema,
  type typeCompetitionParticipantSchema,
  type typeCompetitionSchema,
  type typeCompetitionSchemaPartial,
  type typeCompetitionCategoriesSchema,
  type SaveParticipantResult,
  competitionCategoriesSchema,
  competitionCounterSchema,
  competitionParticipantSchema,
  competitionSchema,
  competitionSchemaPartial,
} from "@cronope/schemas";
import { CompetitionService } from "./competition.service";
import { ZodValidationPipe } from "../../common";
import { Controller, Get, Post, Body, Patch, Param, Delete } from "@nestjs/common";

@Controller("competition")
export class CompetitionController {
  constructor(private readonly competitionService: CompetitionService) {}

  @Post() // check
  create(@Body(new ZodValidationPipe(competitionSchema)) body: typeCompetitionSchema) {
    return this.competitionService.create(body);
  }

  @Get()
  findAll() {
    return this.competitionService.findAll();
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.competitionService.delete(id);
  }

  @Patch("toggle/:id")
  toggle(@Param("id") id: string) {
    return this.competitionService.toggle(id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body(new ZodValidationPipe(competitionSchemaPartial))
    updateCompetitionDto: typeCompetitionSchemaPartial,
  ) {
    return this.competitionService.update(id, updateCompetitionDto);
  }

  @Patch("update-counters/:id")
  updateCounter(
    @Param("id") id: string,
    @Body(new ZodValidationPipe(competitionCounterSchema)) body: typeCompetitionCounterSchema,
  ) {
    return this.competitionService.updateCounters(id, body);
  }

  @Patch("update-categories/:id")
  updateCategories(
    @Param("id") id: string,
    @Body(new ZodValidationPipe(competitionCategoriesSchema)) body: typeCompetitionCategoriesSchema,
  ) {
    return this.competitionService.updateCategories(id, body);
  }
  @Patch("update-participants/:id")
  updateParticipants(
    @Param("id") id: string,
    @Body(new ZodValidationPipe(competitionParticipantSchema))
    body: typeCompetitionParticipantSchema,
  ) {
    return this.competitionService.updateParticipants(id, body);
  }

  @Get("today")
  findTodayCompetition() {
    return this.competitionService.getTodayCompetition();
  }

  @Patch("add-participant-time/:participantId")
  addParticipantResult(
    @Param("participantId") participantId: string,
    @Body() body: SaveParticipantResult,
  ) {
    return this.competitionService.addParticipantTime(+participantId, body);
  }

  @Get("results/:id")
  getResults(@Param("id") id: string) {
    return this.competitionService.getResults(id);
  }

  // al final
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.competitionService.findOne(id);
  }
}
