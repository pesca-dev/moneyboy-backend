import { AuthController } from "@moneyboy/auth/auth.controller";
import { AuthService } from "@moneyboy/auth/auth.service";
import { JwtStrategy } from "@moneyboy/auth/strategies/jwt.strategy";
import { LocalStrategy } from "@moneyboy/auth/strategies/local.strategy";
import variables from "@moneyboy/config/variables";
import { EventModule } from "@moneyboy/events/event.module";
import { SessionModule } from "@moneyboy/session/session.module";
import { UserModule } from "@moneyboy/user/user.module";
import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";

/**
 * Module for handling authentication related code.
 *
 * @author Louis Meyer
 */
@Module({
    imports: [
        UserModule,
        SessionModule,
        PassportModule,
        JwtModule.register({
            secret: variables.token.accessTokenSecret,
        }),
        EventModule,
    ],
    providers: [AuthService, LocalStrategy, JwtStrategy],
    controllers: [AuthController],
})
export class AuthModule {}
