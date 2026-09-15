import { NestFactory } from "@nestjs/core";

import { AppModule } from "./app.module";

import { AllExceptionsFilter, TransformInterceptor } from "../common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
  });

  app.setGlobalPrefix("api");

  app.enableCors({
    origin: ["http://localhost:5173", "http://localhost:5174", "http://192.168.1.54:5173"],

    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",

    credentials: true,
  });

  app.useGlobalInterceptors(new TransformInterceptor());

  app.useGlobalFilters(new AllExceptionsFilter());

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
