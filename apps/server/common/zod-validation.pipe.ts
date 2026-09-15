import { PipeTransform, ArgumentMetadata, BadRequestException } from "@nestjs/common";
import z, { ZodType, ZodError } from "zod";
import { consoleError } from "../src/lib";

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodType) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    try {
      return this.schema.parse(value);
    } catch (error) {
      consoleError(error);

      if (error instanceof ZodError) {
        const messages = z.flattenError(error).fieldErrors;

        const formattedMessages: string[] = [];

        for (let key in messages) {
          const message = messages[key][0].replaceAll("Invalid input", key);

          formattedMessages.push(message);
        }

        throw new BadRequestException(formattedMessages);
      }

      throw new BadRequestException("Validation failed");
    }
  }
}
