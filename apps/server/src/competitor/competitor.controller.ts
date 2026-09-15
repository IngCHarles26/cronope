import {
  competitorSchema,
  competitorSchemaPartial,
  type typeCompetitorSchemaPartial,
  type typeCompetitorSchema,
} from "@cronope/schemas";
import { CompetitorService } from "./competitor.service";
import { ZodValidationPipe } from "../../common";
import { Controller, Get, Post, Body, Patch, Param } from "@nestjs/common";
import { AllowAnonymous } from "@thallesp/nestjs-better-auth";

@Controller("competitor")
@AllowAnonymous()
export class CompetitorController {
  constructor(private readonly competitorService: CompetitorService) {}

  @Post()
  create(@Body(new ZodValidationPipe(competitorSchema)) body: typeCompetitorSchema) {
    return this.competitorService.create(body);
  }

  @Get()
  findAll() {
    return this.competitorService.findAll();
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body(new ZodValidationPipe(competitorSchemaPartial)) body: typeCompetitorSchemaPartial,
  ) {
    return this.competitorService.update(id, body);
  }

  @Patch("toggle-ban/:id")
  ban(@Param("id") id: string, @Body("reason") body: string) {
    return this.competitorService.toggleBan(id, body);
  }
}
