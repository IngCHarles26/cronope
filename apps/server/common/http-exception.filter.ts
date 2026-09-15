// src/common/filters/http-exception.filter.ts
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from "@nestjs/common";
import { Response } from "express";

// Maneja todas las excepciones HTTP lanzadas en la aplicación y devuelve una respuesta uniforme al cliente. Esto permite que los errores sean manejados de manera consistente y proporciona información clara sobre el estado de la solicitud.
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse = exception instanceof HttpException ? exception.getResponse() : null;

    let errorMessage: any = "Internal server error";

    if (exceptionResponse) {
      if (typeof exceptionResponse === "object" && exceptionResponse !== null) {
        errorMessage = (exceptionResponse as any).message || exceptionResponse;
      } else {
        errorMessage = exceptionResponse;
      }
    } else if (exception instanceof Error) {
      errorMessage = exception.message;
    }

    response.status(status).json({
      success: false,
      statusCode: status,
      data: null,
      message: errorMessage,
    });
  }
}
