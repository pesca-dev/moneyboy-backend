import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "../pipes/validation.pipe";
import { AppModule } from "./app.module";

export async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    // use validation globally
    app.useGlobalPipes(new ValidationPipe());
    await app.listen(3000);
}
