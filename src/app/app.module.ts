import { AuthModule } from "@auth/auth.module";
import { JwtAuthGuard } from "@auth/guards/jwt-auth.guard";
import routes from "@config/routes";
import variables from "@config/variables";
import { Session } from "@models/session";
import { User } from "@models/user";
import { MailerModule } from "@nestjs-modules/mailer";
import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { ThrottlerModule } from "@nestjs/throttler";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "@user/user.module";
import { RouterModule } from "nest-router";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

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
