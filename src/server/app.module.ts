import { MiddlewareConsumer, Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./routes/auth/auth.module";
import { AuthService } from "./routes/auth/auth.service";

@Module({
    imports: [AuthModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthService.authenticateToken).forRoutes("posts");
    }
}
