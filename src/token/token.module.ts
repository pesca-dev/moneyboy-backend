import { Module } from "@nestjs/common";
import { SessionModule } from "@session/session.module";
import { TokenService } from "token/token.service";

/**
 * Module for containing and managing auth tokens.
 *
 * @author Louis Meyer
 */
@Module({
    imports: [SessionModule],
    providers: [TokenService],
    exports: [TokenService],
})
export class TokenModule {}
