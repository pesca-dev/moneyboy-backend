import { DatabaseModule } from "@database/database.module";
import { Module } from "@nestjs/common";
import { SessionService } from "@session/session.service";
import { UserModule } from "@user/user.module";

/**
 * Module for managing login sessions.
 *
 * @author Louis Meyer
 */
@Module({
    providers: [SessionService],
    exports: [SessionService],
    imports: [DatabaseModule, UserModule],
})
export class SessionModule {}
