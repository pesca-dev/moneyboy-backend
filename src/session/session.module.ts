import { Module } from "@nestjs/common";

import { SessionService } from "./session.service";

/**
 * Module for managing and containing user sessions.
 *
 * @author Louis Meyer
 */
@Module({
    exports: [SessionService],
    providers: [SessionService],
})
export class SessionModule {}
