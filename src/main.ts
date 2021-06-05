import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import helmet from "helmet";
// import csurf from "csurf";

import { ValidationPipe } from "@pipes/validation.pipe";
import { AppModule } from "@app/app.module";

(async () => {
    const app = await NestFactory.create(AppModule, { cors: true });
    app.use(helmet());
    // app.use(csurf);
    // use validation globally
    app.useGlobalPipes(new ValidationPipe());
    await app.listen(3000);
})();
