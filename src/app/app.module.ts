import { Module } from "@nestjs/common";
import { RouterModule } from "nest-router";

import routes from "@config/routes";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "@auth/auth.module";
import { UserModule } from "@user/user.module";
import { APP_GUARD } from "@nestjs/core";
import { JwtAuthGuard } from "@auth/guards/jwt-auth.guard";

/**
 * Main module for the entire app.
 *
 * @author Louis Meyer
 */
@Module({
    imports: [RouterModule.forRoutes(routes), AuthModule, UserModule],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard,
        },
    ],
})
export class AppModule {}
