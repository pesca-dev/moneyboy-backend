import { AppModule } from "@moneyboy/app/app.module";
// import csurf from "csurf";
import { ValidationPipe } from "@moneyboy/pipes/validation.pipe";
import { NestFactory } from "@nestjs/core";
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
