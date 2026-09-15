import { Controller, Post, Body, Patch, Param, Get } from "@nestjs/common";
import { OthersService } from "./others.service";
import { ZodValidationPipe } from "../../common";
import {
  newCategoriesSchema,
  newTeamsSchema,
  editTeamSchema,
  type typeNewTeamsSchema,
  type typeNewCategoriesSchema,
  type typeEditTeamSchema,
} from "@cronope/schemas";
import { AllowAnonymous } from "@thallesp/nestjs-better-auth";

@Controller("others")
// @AllowAnonymous()
export class OthersController {
  constructor(private readonly othersService: OthersService) {}

  @Post("/categories")
  createCategory(@Body(new ZodValidationPipe(newCategoriesSchema)) body: typeNewCategoriesSchema) {
    return this.othersService.createCategories(body);
  }

  @Get("/categories")
  findAllCategories() {
    return this.othersService.findAllCategories();
  }

  @Post("/teams")
  createTeam(@Body(new ZodValidationPipe(newTeamsSchema)) body: typeNewTeamsSchema) {
    return this.othersService.createTeams(body);
  }

  @Get("/teams")
  findAllTeams() {
    return this.othersService.findAllTeams();
  }

  @Patch("/team/:id")
  updateTeam(
    @Param("id") id: string,
    @Body(new ZodValidationPipe(editTeamSchema)) body: typeEditTeamSchema,
  ) {
    return this.othersService.updateTeam(id, body);
  }

  @Get("/seed")
  @AllowAnonymous()
  seed() {
    return this.othersService.seed();
  }
}
