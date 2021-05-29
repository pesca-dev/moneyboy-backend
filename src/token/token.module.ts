import { Module } from "@nestjs/common";
import { SessionModule } from "@session/session.module";
import { TokenService } from "token/token.service";

@Module({
    imports: [SessionModule],
    providers: [TokenService],
    exports: [TokenService],
})
export class TokenModule {}
