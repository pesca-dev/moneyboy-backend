import { Module } from "@nestjs/common";
import { RouterModule } from "nest-router";
import { APP_GUARD } from "@nestjs/core";
import { TypeOrmModule } from "@nestjs/typeorm";

import routes from "@config/routes";
import variables from "@config/variables";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "@auth/auth.module";
import { UserModule } from "@user/user.module";
import { JwtAuthGuard } from "@auth/guards/jwt-auth.guard";
import { User } from "@models/user";
import { Session } from "@models/session";
import { ThrottlerModule } from "@nestjs/throttler";
import { MailerModule } from "@nestjs-modules/mailer";

/**
 * Main module for the entire app.
 *
 * @author Louis Meyer
 */
@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: "mysql",
            host: variables.database.host,
            port: variables.database.port,
            username: variables.database.username,
            password: variables.database.password,
            database: variables.database.name,
            entities: [User, Session],
            // synchronize: true,
        }),
        ThrottlerModule.forRoot({
            ttl: 60,
            limit: 10,
        }),
        MailerModule.forRoot({
            transport: {
                host: variables.mail.host,
                port: variables.mail.port,
                auth: variables.mail.auth,
            },
        }),
        RouterModule.forRoutes(routes),
        AuthModule,
        UserModule,
    ],
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
