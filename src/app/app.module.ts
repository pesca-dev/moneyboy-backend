import { MiddlewareConsumer, Module } from "@nestjs/common";
import { RouterModule } from "nest-router";

import { AuthModule } from "@auth/auth.module";
import { AuthService } from "@auth/auth.service";
import routes from "@config/routes";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";

@Module({
    imports: [RouterModule.forRoutes(routes), AuthModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthService.authenticateToken).forRoutes("posts");
    }
}
