import { AppModule } from "@app/app.module";
import { NestFactory } from "@nestjs/core";
// import csurf from "csurf";
import { ValidationPipe } from "@pipes/validation.pipe";
import helmet from "helmet";
import "reflect-metadata";

(async () => {
    const app = await NestFactory.create(AppModule, {
        cors: true,
    });
    app.use(helmet());
    // app.use(csurf);
    // use validation globally
    app.useGlobalPipes(new ValidationPipe());
    await app.listen(3000);
})();
