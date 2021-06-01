import { Module } from "@nestjs/common";
import { RouterModule } from "nest-router";

import routes from "@config/routes";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

/**
 * Main module for the entire app.
 *
 * @author Louis Meyer
 */
@Module({
    imports: [RouterModule.forRoutes(routes)],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
