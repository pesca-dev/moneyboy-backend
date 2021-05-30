import { MiddlewareConsumer, Module } from "@nestjs/common";
import { RouterModule } from "nest-router";

import { AuthModule } from "@auth/auth.module";
import { TokenService } from "@token/token.service";
import routes from "@config/routes";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TokenModule } from "@token/token.module";

/**
 * Main module for the entire app.
 *
 * @author Louis Meyer
 */
@Module({
    imports: [RouterModule.forRoutes(routes), AuthModule, TokenModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
    constructor(private readonly tokenService: TokenService) {}

    configure(consumer: MiddlewareConsumer) {
        consumer.apply(this.tokenService.authenticateToken.bind(this.tokenService)).forRoutes("*");
    }
}
