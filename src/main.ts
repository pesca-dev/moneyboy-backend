import "reflect-metadata";
import { NestFactory } from "@nestjs/core";

import { ValidationPipe } from "@pipes/validation.pipe";
import { AppModule } from "@app/app.module";

(async () => {
    const app = await NestFactory.create(AppModule);
    // use validation globally
    app.useGlobalPipes(new ValidationPipe());
    await app.listen(3000);
})();
