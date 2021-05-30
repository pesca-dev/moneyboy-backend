import { Module } from "@nestjs/common";

import { SessionModule } from "@session/session.module";
import { UserModule } from "@user/user.module";
import { TokenModule } from "@token/token.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

/**
 * Module for handling and managing authentication.
 *
 * @author Louis Meyer
 */
@Module({
    imports: [TokenModule, UserModule, SessionModule],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule {}
