import { AuthModule } from "@auth/auth.module";
import { JwtAuthGuard } from "@auth/guards/jwt-auth.guard";
import routes from "@config/routes";
import variables from "@config/variables";
import { MailModule } from "@mail/mail.module";
import { Session } from "@models/session";
import { User } from "@models/user";
import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { EventEmitterModule } from "@nestjs/event-emitter";
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
        EventEmitterModule.forRoot(),
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
        MailModule,
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
