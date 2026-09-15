import { DB_convertString, type typeUserSchema } from "@cronope/schemas";
import { Inject, Injectable } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { apiResponse, auth, checkAdmin, manageError } from "../lib";
import { ConfigService } from "@nestjs/config";
import { UserWithRole } from "better-auth/plugins";

@Injectable()
export class UsersService {
  constructor(
    @Inject(REQUEST) private readonly request: Request & { session: any },
    private env: ConfigService,
  ) {}

  private get session() {
    return this.request.session; // O como 'better-auth' guarde la sesión en el request
  }

  async create({ password, user }: typeUserSchema) {
    try {
      checkAdmin(this.session);

      const name = DB_convertString(user);

      const newUser: UserWithRole = await auth.api.createUser({
        body: {
          email: name + this.env.get<string>("EMAIL_DOMAIN"),
          password: password,
          role: "counter",
          name,
        },
      });

      return apiResponse(true, "Usuario creado correctamente", newUser);
    } catch (error) {
      manageError(error, "user");
    }
  }
}
