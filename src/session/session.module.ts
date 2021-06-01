import { Module } from "@nestjs/common";
import { SessionService } from "@session/session.service";

/**
 * Module for managing login sessions.
 *
 * @author Louis Meyer
 */
@Module({
    providers: [SessionService],
    exports: [SessionService],
})
export class SessionModule {}
