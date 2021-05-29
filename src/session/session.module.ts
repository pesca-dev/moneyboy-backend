import { Module } from "@nestjs/common";
import { SessionService } from "./session.service";

@Module({
    exports: [SessionService],
    providers: [SessionService],
})
export class SessionModule {}
