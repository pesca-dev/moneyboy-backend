import { AuthController } from "@auth/auth.controller";
import { AuthService } from "@auth/auth.service";
import { JwtStrategy } from "@auth/strategies/jwt.strategy";
import { LocalStrategy } from "@auth/strategies/local.strategy";
import variables from "@config/variables";
import { EventModule } from "@events/event.module";
import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { SessionModule } from "@session/session.module";
import { UserModule } from "@user/user.module";

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
