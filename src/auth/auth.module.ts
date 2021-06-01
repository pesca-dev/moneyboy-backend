import { AuthController } from "@auth/auth.controller";
import { AuthService } from "@auth/auth.service";
import { JwtStrategy } from "@auth/strategy/jwt.strategy";
import { LocalStrategy } from "@auth/strategy/local.strategy";
import variables from "@config/variables";
import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { UserModule } from "@user/user.module";

/**
 * Module for handling authentication related code.
 *
 * @author Louis Meyer
 */
@Module({
    imports: [
        UserModule,
        PassportModule,
        JwtModule.register({
            secret: variables.token.accessTokenSecret,
            signOptions: {
                expiresIn: "15m",
            },
        }),
    ],
    providers: [AuthService, LocalStrategy, JwtStrategy],
    controllers: [AuthController],
})
export class AuthModule {}
