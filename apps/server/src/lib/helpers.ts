import { APIResponse, DB_convertString } from "@cronope/schemas";
import { BadRequestException, InternalServerErrorException } from "@nestjs/common";
import { UserSession } from "@thallesp/nestjs-better-auth";

export const transformDate = (date: Date, desface = 60000) => {
  const tzOffset = date.getTimezoneOffset() * desface; // ajuste a la hora de peru
  const localISOTime = new Date(date.getTime() - tzOffset).toISOString();
  const [formatDate, formatTime] = localISOTime.slice(0, 16).split("T");
  const [year, month, day] = formatDate.split("-");

  return [`${day}-${month}-${year}`, formatTime];
};

export const consoleError = (err: any) => {
  const stack = new Error().stack;

  const stackLines = stack?.split("\n") as string[];
  const callerLine = stackLines[2] || "";

  const match = callerLine.match(/at\s+(async\s+)?([^\s(]+)/);
  const functionName = match ? match[2] : "Origen desconocido";

  console.error(`\x1b[31m[ERROR EN: ${functionName}]\x1b[0m`);
  console.error("!______________start-error_________________!");
  console.error(err);
  console.error("!_______________end-error_________________!");
};

//_________________________________________________________________ Retorto genberal del API

export const apiResponse = <T>(
  success: boolean,
  message: string,
  data: T = null as unknown as T,
): Omit<APIResponse<T>, "statusCode"> => ({
  success,
  message,
  data,
});

export const checkAdmin = (session: UserSession) => {
  const role = session.user.role; // Assuming the user has at least one role
  if (role !== "admin")
    throw new BadRequestException("No tienes permisos para realizar esta accion");
};

//_________________________________________________________________ Manejo de errror
// const errorMessage = error.meta.driverAdapterError.cause.originalMessage; //P2002
export const manageError = (error: any, name: string) => {
  consoleError(error);
  const code = error.code;
  let message = error.message;

  if (code) {
    if (code === "P2002") {
      const field = error.meta.driverAdapterError.cause.originalMessage.split('\"')[1];
      message = `'${field}' ya esta en uso en ${name}. Por favor, elige un valor diferente.`;
      throw new BadRequestException(message);
    }

    if (code === "P2025") {
      message = `ID no encontrado en ${name}.`;
      throw new BadRequestException(message);
    }

    if (code === "P2003") {
      const field = error.meta?.field_name || "relation";
      message = `Error de relación: El registro asociado en '${field}' no existe o está protegido.`;
      throw new BadRequestException(message);
    }

    if (code === "P2011") {
      const field = error.meta?.target?.[0] || "field";
      message = `El campo '${field}' no puede ser nulo.`;
      throw new BadRequestException(message);
    }

    if (code === "P2021" || code === "P2022") {
      message = `Error de estructura: La base de datos no está sincronizada con el esquema.`;
      throw new InternalServerErrorException(message);
    }
  }

  if (message === "User already exists. Use another email.")
    throw new BadRequestException("El usuario ya existe");

  throw new InternalServerErrorException(`No se puede realizar la acción en ${name}`);
};
