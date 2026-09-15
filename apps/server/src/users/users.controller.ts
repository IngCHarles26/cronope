import { Controller, Get, Post, Body, Patch, Param, Delete } from "@nestjs/common";
import { UsersService } from "./users.service";
import { ZodValidationPipe } from "../../common";
import { userSchema, type typeUserSchema } from "@cronope/schemas";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post("/new-user")
  create(@Body(new ZodValidationPipe(userSchema)) body: typeUserSchema) {
    return this.usersService.create(body);
  }
}
