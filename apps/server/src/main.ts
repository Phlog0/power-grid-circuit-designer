import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import cookieParser from "cookie-parser";
import { NestExpressApplication } from "@nestjs/platform-express";
async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    const configService = app.get(ConfigService);
    const port = configService.get<number>("SERVER_PORT", 3000);
    const clientUrl = configService.getOrThrow<string>("CLIENT_URL");
    const databaseUrl = configService.getOrThrow<string>("DATABASE_URL");

    app.enableCors({
        origin: [clientUrl, databaseUrl],
        credentials: true,
        allowedHeaders: "Content-Type, Accept, Authorization",
    });

    app.useGlobalPipes(new ValidationPipe());

    app.setGlobalPrefix("api");

    // app.useGlobalInterceptors(new ApiResponseInterceptor());

    // app.use(json({ limit: "100mb" }));
    // app.use(urlencoded({ limit: "100mb", extended: true }));
    app.use(cookieParser());
    // app.useLogger(app.get(Logger));
    const config = new DocumentBuilder()
        .setTitle("Workbench-server-api")
        .setDescription("Описание API сервера")
        .setVersion("1.0")
        .addTag("API")
        .build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);

    SwaggerModule.setup("api", app, documentFactory);

    await app.listen(port, "0.0.0.0");

    console.log(`🚀 Server running on port ${port}`);
}

// eslint-disable-next-line
bootstrap();
