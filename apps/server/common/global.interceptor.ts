import { APIResponse } from "@cronope/schemas";
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";


// Transforma todas las respuestas de la API en un formato uniforme, incluyendo el código de estado HTTP y un mensaje de éxito o error. Esto asegura que todas las respuestas tengan una estructura consistente, lo que facilita el manejo de errores y la interpretación de los datos en el cliente.
@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, APIResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<APIResponse<T>> {
    const response = context.switchToHttp().getResponse();

    return next.handle().pipe(
      map(({ success, data, message }) => {
        return {
          success,
          statusCode: response.statusCode,
          data,
          message,
        };
      }),
    );
  }
}
