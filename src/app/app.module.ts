import { AuthModule } from "@moneyboy/auth/auth.module";
import { JwtAuthGuard } from "@moneyboy/auth/guards/jwt-auth.guard";
import routes from "@moneyboy/config/routes";
import variables from "@moneyboy/config/variables";
import { MailModule } from "@moneyboy/mail/mail.module";
import { Payment } from "@moneyboy/models/payment";
import { Session } from "@moneyboy/models/session";
import { User } from "@moneyboy/models/user";
import { PaymentModule } from "@moneyboy/payment/payment.module";
import { UserModule } from "@moneyboy/user/user.module";
import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { ThrottlerModule } from "@nestjs/throttler";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RouterModule } from "nest-router";

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
            entities: [User, Session, Payment],
            synchronize: true,
        }),
        ThrottlerModule.forRoot({
            ttl: 60,
            limit: 10,
        }),
        MailModule,
        RouterModule.forRoutes(routes),
        AuthModule,
        UserModule,
        PaymentModule,
    ],
    providers: [
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard,
        },
    ],
})
export class AppModule {}
